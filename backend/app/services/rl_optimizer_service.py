import math
import random
from app.services.aqi_service import get_aqi_for_point

class AirAwareRLEnv:
    """
    Reinforcement Learning Environment for Air-Aware Route Optimization.
    State: (lat, lon, target_lat, target_lon, current_aqi, sensitivity_level)
    Action: Discrete index of next candidate road segment.
    Reward: Penalizes travel time, distance, and environmental AQI exposure based on user sensitivity.
    """
    def __init__(self, candidate_routes, health_profile=None):
        self.routes = candidate_routes
        self.profile = health_profile or {}
        self.sensitivity = (self.profile.get("air_sensitivity") or "Moderate").lower()
        self.priority = (self.profile.get("route_priority") or "Health First").lower()
        
        # Scaling factor for environmental sensitivity
        self.alpha_sens = 1.4 if self.sensitivity == "high" else (1.2 if self.sensitivity == "moderate" else 1.0)
        
    def calculate_step_reward(self, distance_km, duration_min, avg_aqi, high_polluted_segments=0):
        """
        Reinforcement Learning Reward Function R(s, a, s'):
        R = - ( w_time * T + w_dist * D + w_env * AQI * alpha_sens + penalty_polluted )
        """
        w_env = 0.55 if "health" in self.priority else (0.35 if "balanced" in self.priority else 0.15)
        w_time = 0.25 if "time" in self.priority else (0.35 if "balanced" in self.priority else 0.25)
        w_dist = 0.20
        
        norm_dist = min(1.0, distance_km / 25.0)
        norm_time = min(1.0, duration_min / 60.0)
        norm_aqi = min(1.0, (avg_aqi * self.alpha_sens) / 200.0)
        
        pollution_penalty = high_polluted_segments * 0.15
        
        cost = (w_env * norm_aqi) + (w_time * norm_time) + (w_dist * norm_dist) + pollution_penalty
        reward = -cost * 100.0
        return round(reward, 2)


class QLearningRouteAgent:
    """
    Q-Learning Agent for Reinforcement Learning Route Optimization.
    Uses Q-table / Policy evaluations to predict optimal clean routing choices.
    """
    def __init__(self, alpha=0.1, gamma=0.9, epsilon=0.1):
        self.alpha = alpha  # Learning rate
        self.gamma = gamma  # Discount factor
        self.epsilon = epsilon  # Exploration rate
        self.q_table = {}

    def get_q_value(self, state, action):
        return self.q_table.get((state, action), 0.0)

    def select_action(self, state, candidate_actions, rewards):
        """Epsilon-greedy action selection for RL agent."""
        if random.random() < self.epsilon:
            return random.choice(candidate_actions)
        
        best_action = candidate_actions[0]
        best_score = -float('inf')
        for action in candidate_actions:
            q_val = self.get_q_value(state, action)
            score = q_val + rewards.get(action, 0.0)
            if score > best_score:
                best_score = score
                best_action = action
        return best_action

    def update_q_value(self, state, action, reward, next_state, next_candidate_actions):
        max_next_q = max([self.get_q_value(next_state, a) for a in next_candidate_actions], default=0.0)
        old_q = self.get_q_value(state, action)
        new_q = old_q + self.alpha * (reward + self.gamma * max_next_q - old_q)
        self.q_table[(state, action)] = new_q


def rl_evaluate_routes(candidate_routes, health_profile=None):
    """
    Evaluates candidate routes using the Reinforcement Learning Environment & Q-Routing Agent.
    """
    if not candidate_routes:
        return None

    env = AirAwareRLEnv(candidate_routes, health_profile)
    agent = QLearningRouteAgent()

    evaluated_routes = []
    actions = [r["id"] for r in candidate_routes]
    rewards = {}

    state = ("start", "destination", env.sensitivity)

    for route in candidate_routes:
        r_id = route["id"]
        dist = route.get("distance_km", 5.0)
        dur = route.get("duration_min", 20)
        
        coords = route.get("coordinates", [])
        sampled = coords[::max(1, len(coords) // 6)] if coords else []
        aqi_sum = 0
        polluted_count = 0

        for pt in sampled:
            aqi_val = get_aqi_for_point(pt[0], pt[1]).get("aqi", 50)
            aqi_sum += aqi_val
            if aqi_val > 80:
                polluted_count += 1

        avg_aqi = round(aqi_sum / max(1, len(sampled)))
        reward = env.calculate_step_reward(dist, dur, avg_aqi, polluted_count)
        rewards[r_id] = reward

        evaluated_routes.append({
            **route,
            "rl_reward": reward,
            "avg_aqi": avg_aqi,
            "high_polluted_segments": polluted_count
        })

    selected_action = agent.select_action(state, actions, rewards)
    best_rl_route = next((r for r in evaluated_routes if r["id"] == selected_action), evaluated_routes[0])

    return {
        "model": "Reinforcement Learning Q-Routing (Q-Table & Policy Reward)",
        "selected_route_id": selected_action,
        "best_rl_route": best_rl_route,
        "evaluated_routes": evaluated_routes
    }
