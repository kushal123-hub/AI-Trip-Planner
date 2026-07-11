from datetime import datetime

from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    Text,
    String,
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    destination = Column(String, nullable=False)

    start_date = Column(Date, nullable=False)

    end_date = Column(Date, nullable=False)

    budget = Column(Numeric(10, 2), nullable=False)

    interests = Column(Text, nullable=True)

    travel_style = Column(String, nullable=True)

    ai_itinerary = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    user = relationship("User", back_populates="trips")