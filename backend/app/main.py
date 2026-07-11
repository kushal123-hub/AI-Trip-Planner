from fastapi import FastAPI

from app.api.ai import router as ai_router
from app.api.auth import router as auth_router
from app.api.trip import router as trip_router
from app.db.database import Base, engine

# Import all models before creating tables
from app.models.trip import Trip
from app.models.user import User

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Trip Planner API",
    version="1.0.0",
    description="Backend API for AI Trip Planner",
)

# Register API Routers
app.include_router(auth_router)
app.include_router(trip_router)
app.include_router(ai_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to AI Trip Planner API"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }