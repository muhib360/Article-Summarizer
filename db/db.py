from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from collections.abc import AsyncGenerator
from sqlalchemy.orm import DeclarativeBase
from settings import db_settings

class Base(DeclarativeBase):
    pass

engine = create_async_engine(db_settings.db_url, echo=True)

async_session_local = async_sessionmaker(class_=AsyncSession, bind=engine, expire_on_commit=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_local() as session:
        yield session