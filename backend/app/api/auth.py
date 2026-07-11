from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import UserRegister
from app.schemas.user import UserResponse
from app.services.auth_service import (
    login_user,
    register_user,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):
    return register_user(user, db)


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    return login_user(form_data, db)


@router.get("/me", response_model=UserResponse)
def me(
    current_user: User = Depends(get_current_user),
):
    return current_user