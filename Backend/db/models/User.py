from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String
from db.db import Base
import uuid

class User(Base):
    __tablename__ = "user"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firebase_uid: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    username: Mapped[str | None] = mapped_column(unique=True, nullable=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    articles: Mapped[list["Article"]] = relationship(back_populates="user")