from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy import ForeignKey, String
from typing import Any
from db.db import Base
import uuid

class Article(Base):
    __tablename__ = "article"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(nullable=False)
    bullet_points: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False)
    tldr: Mapped[str] = mapped_column(nullable=False)
    additional_info: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    user: Mapped["User"] = relationship(back_populates="articles")  # type: ignore[name-defined]