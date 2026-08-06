import asyncio
from sqlalchemy import text
from db.db import engine

async def main():
    async with engine.begin() as conn:
        await conn.execute(text('TRUNCATE TABLE "user" CASCADE;'))
    print("Database cleared successfully!")

if __name__ == "__main__":
    asyncio.run(main())
