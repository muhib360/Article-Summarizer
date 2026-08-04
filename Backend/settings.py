from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

class Model_Settings(Settings):
    open_router_key: str
    model_base_url: str
    model_name: str

model_settings = Model_Settings()  # pyright: ignore[reportCallIssue]

class Database_Settings(Settings):
    db_url: str

db_settings = Database_Settings()  # pyright: ignore[reportCallIssue]

class Firebase_Settings(Settings):
    firebase_service_account_path: str = "firebase-service-account.json"

firebase_settings = Firebase_Settings()  # pyright: ignore[reportCallIssue]