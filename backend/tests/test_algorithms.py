from app.algorithms.pathfinding import dijkstra
from app.services.routing_service import _pick_route_indexes


def test_dijkstra_short_path():
    graph = {
        1: [{"to": 2, "distance_km": 1.0}, {"to": 3, "distance_km": 3.0}],
        2: [{"to": 3, "distance_km": 1.0}],
        3: [],
    }

    path, cost = dijkstra(graph, 1, 3, lambda e: e["distance_km"])

    assert path == [1, 2, 3]
    assert cost == 2.0


def test_pick_route_indexes_shortest_uses_min_distance():
    routes = [
        {"distance_km": 16.237, "duration_min": 20.4},
        {"distance_km": 14.887, "duration_min": 20.6},
        {"distance_km": 15.1, "duration_min": 19.9},
    ]

    shortest_idx, fastest_idx, healthiest_idx = _pick_route_indexes(routes)

    assert shortest_idx == 1
    assert fastest_idx == 2
    assert healthiest_idx == 0


def test_rl_route_optimizer():
    from app.services.rl_optimizer_service import rl_evaluate_routes
    routes = [
        {"id": "route_1", "distance_km": 5.0, "duration_min": 20, "coordinates": [[12.97, 77.59], [12.98, 77.60]]},
        {"id": "route_2", "distance_km": 6.0, "duration_min": 22, "coordinates": [[12.97, 77.59], [12.96, 77.61]]}
    ]
    res = rl_evaluate_routes(routes, {"air_sensitivity": "High", "route_priority": "Health First"})
    assert res is not None
    assert "model" in res
    assert res["selected_route_id"] in ["route_1", "route_2"]

