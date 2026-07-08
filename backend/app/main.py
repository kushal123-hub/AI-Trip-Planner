from fastapi import FastAPI
from app.db.database import Base, engine
from app.models.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Trip Planner API",
    version="1.0.0",
    description="Backend API for AI Trip Planner"
)

@app.get("/")
def root():
    return {"message": "Welcome to AI Trip Planner API"}

@app.get("/health")
def health():
    return {"status": "healthy"}