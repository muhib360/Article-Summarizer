import firebase_admin
from firebase_admin import credentials
from settings import firebase_settings

def initialize_firebase() -> None:
    """Initialize the Firebase Admin SDK (idempotent — safe to call multiple times)."""
    if firebase_admin._apps:
        return

    cred = credentials.Certificate(firebase_settings.firebase_service_account_path)
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized.")
