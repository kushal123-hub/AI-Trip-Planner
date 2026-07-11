from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    hashed_password = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    trips = relationship(
        "Trip",
        back_populates="user",
        cascade="all, delete-orphan",
    )