from pydantic import BaseModel


class AIRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: float
    interests: str
    travel_style: str


class AIResponse(BaseModel):
    itinerary: str