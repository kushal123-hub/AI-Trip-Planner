from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.schemas.trip import TripCreate


def create_trip(user_id: int, trip: TripCreate, db: Session):
    new_trip = Trip(
        user_id=user_id,
        destination=trip.destination,
        start_date=trip.start_date,
        end_date=trip.end_date,
        budget=trip.budget,
        interests=trip.interests,
        travel_style=trip.travel_style,
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return new_trip


def get_trip(trip_id: int, db: Session):
    return db.query(Trip).filter(Trip.id == trip_id).first()


def get_all_trips(user_id: int, db: Session):
    return (
        db.query(Trip)
        .filter(Trip.user_id == user_id)
        .order_by(Trip.created_at.desc())
        .all()
    )


def update_trip(
    trip_id: int,
    trip_data: TripCreate,
    user_id: int,
    db: Session,
):
    trip = get_trip(trip_id, db)

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    if trip.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    trip.destination = trip_data.destination
    trip.start_date = trip_data.start_date
    trip.end_date = trip_data.end_date
    trip.budget = trip_data.budget
    trip.interests = trip_data.interests
    trip.travel_style = trip_data.travel_style

    db.commit()
    db.refresh(trip)

    return trip


def delete_trip(
    trip_id: int,
    user_id: int,
    db: Session,
):
    trip = get_trip(trip_id, db)

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    if trip.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    db.delete(trip)
    db.commit()

    return {
        "message": "Trip deleted successfully"
    }