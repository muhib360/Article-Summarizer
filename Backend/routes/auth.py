from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.db import get_db
from db.models.User import User
from dependencies.auth import get_current_user
from models import UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])
bearer_scheme = HTTPBearer()


@router.post("/sync", response_model=UserResponse)
async def sync_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
):
    """Sync a Firebase user to the local database (upsert).

    The frontend calls this once after every Firebase sign-in.
    If the user doesn't exist locally, a new record is created.
    If they already exist, their email and display name are updated.
    """
    token = credentials.credentials
    try:
        decoded_token = firebase_auth.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    firebase_uid: str = decoded_token["uid"]
    email: str = decoded_token.get("email", "")
    display_name: str | None = decoded_token.get("name")

    # Check if user already exists
    result = await db.execute(
        select(User).where(User.firebase_uid == firebase_uid)
    )
    user = result.scalars().first()

    if user:
        user.email = email
        user.username = display_name
        await db.commit()
        await db.refresh(user)
        return user

    # Create new user
    user = User(
        firebase_uid=firebase_uid,
        email=email,
        username=display_name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user
