from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.trip import TripCreate
from app.services.trip_service import (
    create_trip,
    delete_trip,
    get_all_trips,
    get_trip,
    update_trip,
)

router = APIRouter(
    prefix="/trip",
    tags=["Trips"],
)


@router.post("/create")
def create_new_trip(
    trip: TripCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_trip(current_user.id, trip, db)


@router.get("/history")
def trip_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_all_trips(current_user.id, db)


@router.get("/{trip_id}")
def get_single_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = get_trip(trip_id, db)

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    if trip.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return trip


@router.put("/{trip_id}")
def update_single_trip(
    trip_id: int,
    trip: TripCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_trip(
        trip_id,
        trip,
        current_user.id,
        db,
    )


@router.delete("/{trip_id}")
def delete_single_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_trip(
        trip_id,
        current_user.id,
        db,
    )