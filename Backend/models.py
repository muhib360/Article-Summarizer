from typing import Optional, Any
from pydantic import BaseModel, HttpUrl
from datetime import datetime
import uuid

class Summary(BaseModel):
    title: str
    bullet_points: list[str]
    tldr: str
    additional_info: dict[str, str] | None

class SaveBlogRequest(BaseModel):
    source_url: HttpUrl
    title: str
    bullet_points: list[str]
    tldr: str
    additional_info: dict[str, Any] | None = None

class SavedBlogResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    source_url: str
    title: str
    bullet_points: list[str]
    tldr: str
    additional_info: dict[str, Any] | None
    saved_at: datetime
    user_id: uuid.UUID

class SavedBlogListItem(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    source_url: str
    title: str
    tldr: str
    saved_at: datetime

class UserResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    firebase_uid: str
    display_name: str | None
    email: str