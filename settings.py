from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env')

class Model_Settings(Settings):
    open_router_key: str
    model_base_url: str
    model_name: str

model_settings = Model_Settings()  # pyright: ignore[reportCallIssue]

class Database_Settings(BaseSettings):
    db_url: str