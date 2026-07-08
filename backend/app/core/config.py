from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AI Trip Planner"
    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str = "sqlite:///./trip_planner.db"

    SECRET_KEY: str = "CHANGE_ME_TO_A_RANDOM_SECRET"

    class Config:
        env_file = ".env"


settings = Settings()