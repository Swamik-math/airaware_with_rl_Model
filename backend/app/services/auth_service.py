import hashlib
import hmac
import time
import base64
import json
from flask import current_app

def hash_password(password: str) -> str:
    """Hashes password securely using SHA-256 with salt."""
    salt = "airpath_salt_v1_secure"
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()

def verify_password(password: str, password_hash: str) -> bool:
    """Verifies a password against hash."""
    return hash_password(password) == password_hash

def generate_token(user_id: int) -> str:
    """Generates a base64 encoded JSON token with signature."""
    secret = current_app.config.get("SECRET_KEY", "airpath-dev-key")
    payload = {
        "user_id": user_id,
        "exp": int(time.time()) + (86400 * 30) # 30 days expiry
    }
    payload_bytes = base64.urlsafe_b64encode(json.dumps(payload).encode('utf-8')).decode('utf-8')
    signature = hmac.new(secret.encode('utf-8'), payload_bytes.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"{payload_bytes}.{signature}"

def decode_token(token: str) -> int:
    """Decodes token and returns user_id if valid."""
    if not token or "." not in token:
        return None
    secret = current_app.config.get("SECRET_KEY", "airpath-dev-key")
    parts = token.split(".")
    if len(parts) != 2:
        return None
    payload_bytes, signature = parts[0], parts[1]
    expected_sig = hmac.new(secret.encode('utf-8'), payload_bytes.encode('utf-8'), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected_sig):
        return None
    try:
        data = json.loads(base64.urlsafe_b64decode(payload_bytes.encode('utf-8')).decode('utf-8'))
        if data.get("exp", 0) < time.time():
            return None
        return data.get("user_id")
    except Exception:
        return None
