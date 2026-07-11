from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class TripCreate(BaseModel):
    destination: str
    start_date: date
    end_date: date
    budget: Decimal
    interests: str | None = None
    travel_style: str | None = None


class TripResponse(BaseModel):
    id: int
    destination: str
    start_date: date
    end_date: date
    budget: Decimal
    interests: str | None
    travel_style: str | None
    ai_itinerary: str | None

    class Config:
        from_attributes = True