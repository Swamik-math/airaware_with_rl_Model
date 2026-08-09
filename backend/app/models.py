from datetime import datetime
from app.extensions import db
import json

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    profile = db.relationship("HealthProfile", backref="user", uselist=False, cascade="all, delete-orphan")
    saved_routes = db.relationship("SavedRoute", backref="user", cascade="all, delete-orphan")
    route_history = db.relationship("RouteHistory", backref="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }

class HealthProfile(db.Model):
    __tablename__ = "health_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    conditions = db.Column(db.JSON, default=list) # e.g. ["Asthma", "Allergic rhinitis"]
    air_sensitivity = db.Column(db.String(50), default="Moderate") # Low, Moderate, High
    priority_pollutants = db.Column(db.JSON, default=list) # e.g. ["PM2.5", "NO2"]
    route_priority = db.Column(db.String(50), default="Health First") # Health First, Balanced, Time First
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "conditions": self.conditions or [],
            "air_sensitivity": self.air_sensitivity or "Moderate",
            "priority_pollutants": self.priority_pollutants or ["PM2.5"],
            "route_priority": self.route_priority or "Health First",
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class SavedRoute(db.Model):
    __tablename__ = "saved_routes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    source_name = db.Column(db.String(255), nullable=False)
    destination_name = db.Column(db.String(255), nullable=False)
    source_lat = db.Column(db.Float, nullable=False)
    source_lon = db.Column(db.Float, nullable=False)
    destination_lat = db.Column(db.Float, nullable=False)
    destination_lon = db.Column(db.Float, nullable=False)
    mode = db.Column(db.String(20), default="walking")
    health_score = db.Column(db.Integer, default=90)
    avg_aqi = db.Column(db.Integer, default=45)
    distance_km = db.Column(db.Float, default=5.0)
    duration_min = db.Column(db.Integer, default=25)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "source_name": self.source_name,
            "destination_name": self.destination_name,
            "source": {"lat": self.source_lat, "lon": self.source_lon},
            "destination": {"lat": self.destination_lat, "lon": self.destination_lon},
            "mode": self.mode,
            "health_score": self.health_score,
            "avg_aqi": self.avg_aqi,
            "distance_km": self.distance_km,
            "duration_min": self.duration_min,
            "created_at": self.created_at.isoformat()
        }

class RouteHistory(db.Model):
    __tablename__ = "route_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    source_name = db.Column(db.String(255), nullable=True)
    destination_name = db.Column(db.String(255), nullable=True)
    source_lat = db.Column(db.Float, nullable=False)
    source_lon = db.Column(db.Float, nullable=False)
    destination_lat = db.Column(db.Float, nullable=False)
    destination_lon = db.Column(db.Float, nullable=False)
    preference = db.Column(db.String(50), nullable=False, default="healthiest")
    mode = db.Column(db.String(20), default="walking")
    selected_type = db.Column(db.String(20), default="healthiest")
    health_score = db.Column(db.Integer, default=85)
    avg_aqi = db.Column(db.Integer, default=45)
    distance_km = db.Column(db.Float, default=6.0)
    duration_min = db.Column(db.Integer, default=30)
    shortest_summary = db.Column(db.JSON, nullable=True)
    fastest_summary = db.Column(db.JSON, nullable=True)
    healthiest_summary = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "source_name": self.source_name or f"{self.source_lat:.4f}, {self.source_lon:.4f}",
            "destination_name": self.destination_name or f"{self.destination_lat:.4f}, {self.destination_lon:.4f}",
            "source": {"lat": self.source_lat, "lon": self.source_lon},
            "destination": {"lat": self.destination_lat, "lon": self.destination_lon},
            "preference": self.preference,
            "mode": self.mode,
            "selected_type": self.selected_type,
            "health_score": self.health_score,
            "avg_aqi": self.avg_aqi,
            "distance_km": self.distance_km,
            "duration_min": self.duration_min,
            "created_at": self.created_at.isoformat()
        }
