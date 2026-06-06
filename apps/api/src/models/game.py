from pydantic import BaseModel
from typing import Optional, List, Dict
from enum import Enum

class Side(str, Enum):
    RED = "red"
    BLACK = "black"

class GameStatus(str, Enum):
    WAITING = "waiting"
    PLAYING = "playing"
    FINISHED = "finished"

class PieceType(str, Enum):
    CT = "CT"  # Sâm
    S = "S"    # Advisor
    X = "X"    # Minister
    M = "M"    # Horse
    P = "P"    # Cannon
    T = "T"    # Soldier

class Position(BaseModel):
    row: int
    col: int

class Piece(BaseModel):
    type: PieceType
    side: Side

class PlayerInfo(BaseModel):
    id: str
    name: str
    side: Side
    connected: bool = True

class MoveRecord(BaseModel):
    moveNumber: int
    from_coord: str
    to_coord: str
    piece: str
    captured_piece: Optional[str] = None
    is_sacrifice: bool = False
    timestamp: str

class RoomCreate(BaseModel):
    name: str
    is_private: bool = False
    player_id: str
    player_name: str = "Anonymous"

class RoomResponse(BaseModel):
    id: str
    room_code: str
    name: str
    is_private: bool
    status: str
    players: Dict[str, Optional[PlayerInfo]]
    share_url: Optional[str] = None

class GameCreate(BaseModel):
    room_code: str
    player_id: str
    player_name: str = "Anonymous"

class MoveRequest(BaseModel):
    player_id: str
    from_pos: str  # notation like "d1"
    to_pos: str    # notation like "d2"

class GameResponse(BaseModel):
    id: str
    room_code: str
    players: Dict[str, Optional[PlayerInfo]]
    board: List[List[Optional[str]]]
    current_turn: Side
    move_history: List[MoveRecord]
    status: GameStatus
    winner: Optional[Side] = None
    end_condition: Optional[str] = None