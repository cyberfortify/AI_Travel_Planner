from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user_model import User
from app.auth.auth_handler import (
    hash_password,
    verify_password
)

router = APIRouter()

# ----------------------------
# REQUEST MODELS
# ----------------------------

class SignupRequest(BaseModel):

    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):

    email: EmailStr
    password: str


# ----------------------------
# SIGNUP
# ----------------------------

@router.post("/signup")

def signup(data: SignupRequest):

    db: Session = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password)
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User created successfully"
    }


# ----------------------------
# LOGIN
# ----------------------------

@router.post("/login")

def login(data: LoginRequest):

    db: Session = SessionLocal()

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=400,
            detail="Invalid email"
        )

    valid = verify_password(
        data.password,
        user.password
    )

    if not valid:

        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }