from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.ai import AIRequest, AIResponse

from app.services.ai_service import generate_itinerary
from app.services.trip_service import save_ai_itinerary

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post("/generate", response_model=AIResponse)
def generate_trip(
    request: AIRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    itinerary = generate_itinerary(request)

    save_ai_itinerary(
        trip_id=request.trip_id,
        itinerary=itinerary,
        user_id=current_user.id,
        db=db,
    )

    return AIResponse(
        itinerary=itinerary
    )