import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://10.60.184.61:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "co_tuong_sam")

class Database:
    client: Optional[AsyncIOMotorClient] = None

db = Database()

async def connect_to_database():
    db.client = AsyncIOMotorClient(MONGODB_URL)
    print(f"Connected to MongoDB at {MONGODB_URL}")

async def close_database_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

def get_database():
    return db.client[MONGODB_DB]