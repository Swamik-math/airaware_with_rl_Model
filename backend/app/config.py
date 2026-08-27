import os
from pathlib import Path


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "airaware-dev-key")
    default_db_path = Path(__file__).resolve().parents[1] / "instance" / "airaware.db"
    default_db_path.parent.mkdir(parents=True, exist_ok=True)

    db_url = os.getenv("DATABASE_URL")
    if not db_url or db_url in ("sqlite:///airaware.db", "sqlite:///backend/instance/airaware.db"):
        db_url = f"sqlite:///{default_db_path.as_posix()}"

    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    AQI_API_URL = os.getenv("AQI_API_URL", "https://api.waqi.info/feed/geo:{lat};{lon}/")
    AQI_API_TOKEN = os.getenv("AQI_API_TOKEN", "")
    MAPPLS_API_KEY = os.getenv("MAPPLS_API_KEY", "")
    MAPPLS_ROUTE_URL_TEMPLATE = os.getenv(
        "MAPPLS_ROUTE_URL_TEMPLATE",
        "https://apis.mappls.com/advancedmaps/v1/{api_key}/route_adv/driving/{origin};{destination}",
    )

