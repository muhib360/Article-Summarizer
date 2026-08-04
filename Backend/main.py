from fastapi import FastAPI
from sqlalchemy import text
from routes import summarize, blogs, auth
from contextlib import asynccontextmanager
from db.db import engine
from firebase_init import initialize_firebase

@asynccontextmanager
async def lifespan_handler(app: FastAPI):
    print("Application is starting...")
    initialize_firebase()
    async with engine.begin() as conn:
        await conn.execute(text("SELECT 1"))
    yield
    print("Application is shutting down...")

app = FastAPI(lifespan=lifespan_handler)

app.include_router(auth.router)
app.include_router(summarize.router)
app.include_router(blogs.router)