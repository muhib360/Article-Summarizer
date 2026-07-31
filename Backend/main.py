from fastapi import FastAPI
from sqlalchemy import text
from routes import summarize, blogs
from contextlib import asynccontextmanager
from db.db import engine

@asynccontextmanager
async def lifespan_handler(app: FastAPI):
    print("Application is starting...")
    async with engine.begin() as conn:
        await conn.execute(text("SELECT 1"))
    yield
    print("Application is shutting down...")

app = FastAPI(lifespan=lifespan_handler)

app.include_router(summarize.router)
app.include_router(blogs.router)