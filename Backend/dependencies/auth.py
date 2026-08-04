from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.db import get_db
from db.models.User import User

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Verify the Firebase ID token and return the corresponding local User.

    Raises 401 if the token is invalid or the user doesn't exist in our DB
    (they need to call /auth/sync first).
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

    result = await db.execute(
        select(User).where(User.firebase_uid == firebase_uid)
    )
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found. Please call /auth/sync first.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
