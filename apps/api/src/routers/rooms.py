from fastapi import APIRouter, HTTPException
from typing import List, Optional
from src.models.game import RoomCreate, RoomResponse

router = APIRouter()

# In-memory storage for demo (would be MongoDB in production)
rooms_db = {}

def generate_room_code():
    import random
    chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return ''.join(random.choice(chars) for _ in range(6))

@router.post("/", response_model=RoomResponse)
async def create_room(data: RoomCreate):
    room_code = generate_room_code()
    room = {
        "id": f"room_{room_code}",
        "room_code": room_code,
        "name": data.name,
        "is_private": data.is_private,
        "status": "waiting",
        "players": {
            "red": {"id": data.player_id, "name": data.player_name, "side": "red", "connected": True},
            "black": None
        },
        "host_id": data.player_id
    }
    rooms_db[room_code] = room
    return RoomResponse(
        id=room["id"],
        room_code=room["room_code"],
        name=room["name"],
        is_private=room["is_private"],
        status=room["status"],
        players=room["players"],
        share_url=f"/game/{room_code}"
    )

@router.get("/", response_model=List[RoomResponse])
async def list_rooms():
    public_rooms = [
        RoomResponse(
            id=r["id"],
            room_code=r["room_code"],
            name=r["name"],
            is_private=r["is_private"],
            status=r["status"],
            players=r["players"]
        )
        for r in rooms_db.values()
        if not r["is_private"] and r["status"] == "waiting"
    ]
    return public_rooms

@router.get("/{room_code}", response_model=RoomResponse)
async def get_room(room_code: str):
    if room_code not in rooms_db:
        raise HTTPException(status_code=404, detail="Room not found")
    r = rooms_db[room_code]
    return RoomResponse(
        id=r["id"],
        room_code=r["room_code"],
        name=r["name"],
        is_private=r["is_private"],
        status=r["status"],
        players=r["players"]
    )

@router.post("/{room_code}/join")
async def join_room(room_code: str, data: RoomCreate):
    if room_code not in rooms_db:
        raise HTTPException(status_code=404, detail="Room not found")

    room = rooms_db[room_code]
    if room["status"] != "waiting":
        raise HTTPException(status_code=400, detail="Game already started")

    if room["players"]["black"] is not None:
        raise HTTPException(status_code=400, detail="Room is full")

    room["players"]["black"] = {"id": data.player_id, "name": data.player_name, "side": "black", "connected": True}
    room["status"] = "playing"

    return RoomResponse(
        id=room["id"],
        room_code=room["room_code"],
        name=room["name"],
        is_private=room["is_private"],
        status=room["status"],
        players=room["players"]
    )

@router.delete("/{room_code}")
async def delete_room(room_code: str, player_id: str):
    if room_code not in rooms_db:
        raise HTTPException(status_code=404, detail="Room not found")

    room = rooms_db[room_code]
    if room["host_id"] != player_id:
        raise HTTPException(status_code=403, detail="Only host can delete room")

    del rooms_db[room_code]
    return {"message": "Room deleted"}