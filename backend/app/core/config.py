from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
    )

    app_name: str = "DClaw Backup"
    app_env: str = "dev"
    debug: bool = True

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5434/dclaw_backup"

    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
