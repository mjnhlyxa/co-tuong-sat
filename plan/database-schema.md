# co-tuong-sat — Database Schema Design

> **C4 Level**: 3 — Component Specification (Database)

## 1. Database Overview

### 1.1 Technology
- **Database**: MongoDB 6.x
- **Driver**: Motor 3.3+ (async Python driver for FastAPI)
- **Host**: 10.60.184.61:27017
- **Database Name**: `co_tuong_sam`

### 1.2 Collections Summary

| Collection | Purpose | Est. Doc Size | Growth |
|------------|---------|---------------|--------|
| games | Active and completed game states | ~4KB | ~50/day |
| rooms | Game rooms (lobby) | ~500B | ~30/day |
| players | Player stats and ELO | ~300B | ~200 total |

---

## 2. Schema Definitions

### 2.1 Games Collection

```python
# apps/api/src/models/game.py
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class GameStatus(str, Enum):
    WAITING = "waiting"      # Waiting for second player
    PLAYING = "playing"      # Game in progress
    FINISHED = "finished"    # Game completed

class EndCondition(str, Enum):
    CHECKMATE = "checkmate"
    SÂM_SACRIFICE = "sâm-sacrifice"
    RESIGNATION = "resignation"
    DRAW_OFFERED = "draw-offered"
    TIMEOUT = "timeout"

class Side(str, Enum):
    RED = "red"
    BLACK = "black"

class PieceType(str, Enum):
    SÂM = "CT"      # Commander (Sâm) - replaces General
    ADVISOR = "S"   # Sĩ
    MINISTER = "X"  # Xe
    HORSE = "M"     # Mã
    CANNON = "P"    # Pháo
    SOLDIER = "T"   # Tốt

class MoveRecord(BaseModel):
    moveNumber: int
    fromCoord: str       # e.g., "I10" (col-row)
    toCoord: str
    piece: str           # Piece code e.g., "c" for black cannon
    capturedPiece: Optional[str] = None
    isSacrifice: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PlayerInfo(BaseModel):
    id: str              # UUID from localStorage
    name: str
    connected: bool = True

class GameDocument(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    roomId: str
    roomCode: str        # 6-char alphanumeric code
    players: Dict[Side, PlayerInfo]  # {"red": {...}, "black": {...}}
    board: List[List[Optional[str]]]  # 10x9 grid, None = empty
    currentTurn: Side = Side.RED
    moveHistory: List[MoveRecord] = []
    status: GameStatus = GameStatus.WAITING
    winner: Optional[Side] = None
    endCondition: Optional[EndCondition] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        use_enum_values = True
```

**Indexes**:
```python
games.create_index("roomId")
games.create_index("roomCode", unique=True)
games.create_index("players.red.id")
games.create_index("players.black.id")
games.create_index([("status", 1), ("createdAt", -1)])
games.create_index("updatedAt", expireAfterSeconds=3600*24*90)  # TTL: 90 days
```

### 2.2 Rooms Collection

```python
# apps/api/src/models/room.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class RoomDocument(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    roomCode: str       # 6-char uppercase alphanumeric (e.g., "ABC123")
    name: str           # Room name (max 50 chars)
    isPrivate: bool = False
    status: str = "waiting"  # waiting | playing | closed
    hostPlayerId: str
    gameId: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Indexes
rooms.create_index("roomCode", unique=True)
rooms.create_index([("isPrivate", 1), ("status", 1)])
rooms.create_index("createdAt", expireAfterSeconds=3600*24*7)  # Auto-delete after 7 days of inactivity
```

### 2.3 Players Collection

```python
# apps/api/src/models/player.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PlayerDocument(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    anonId: str        # UUID from localStorage
    displayName: str
    elo: int = 1200
    gamesPlayed: int = 0
    gamesWon: int = 0
    gamesLost: int = 0
    gamesDrawn: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Indexes
players.create_index("anonId", unique=True)
players.create_index("elo", descending=True)  # For leaderboard
```

---

## 3. Board Data Structure

### 3.1 Coordinate System

- **Internal**: 0-indexed (row 0-9, col 0-8)
- **Display**: Vietnamese notation (a-i for cols 0-8, 1-10 for rows)
  - Col 0 = a, Col 1 = b, ... Col 8 = i
  - Row 1 = rank 1 (top), Row 10 = rank 10 (bottom)
- **Conversion**: `col_letter = chr(ord('a') + col)`, `row_number = 10 - row`

### 3.2 Board Initialization

```
Initial board (row 0 = top, row 9 = bottom):

Black pieces (lowercase in storage):
row 0: [ ,  ,  ,CT,  ,CT,  ,  ,  ]     <- Sâm at d1 and f1 (col 3,5)
row 1: [ ,  ,  ,  ,  ,  ,  ,  ,  ]     <- Empty
row 2: [ ,  ,  , S ,  , S ,  ,  ,  ]    <- Advisors at d2 and f2
row 3: [X ,  , M ,  ,  ,  , M ,  , X]   <- Ministers and Horses
row 4: [ ,  ,  ,  ,  ,  ,  ,  ,  ]      <- River (top half)

row 5: [ ,  ,  ,  ,  ,  ,  ,  ,  ]      <- River (bottom half)
row 6: [x ,  , m ,  ,  ,  , m ,  , x]   <- Black mirrored
row 7: [ ,  ,  , s ,  , s ,  ,  ,  ]    <- Advisors
row 8: [ ,  ,  ,  ,  ,  ,  ,  ,  ]      <- Empty
row 9: [ ,  ,  ,ct,  ,ct,  ,  ,  ]      <- Sâm mirrored

Red pieces (uppercase):
row 0: [ ,  ,  ,CT,  ,CT,  ,  ,  ]     <- Sâm
row 1: [ ,  ,  ,  ,  ,  ,  ,  ,  ]
row 2: [ ,  ,  , S ,  , S ,  ,  ,  ]    <- Advisors
row 3: [X ,  , M ,  ,  ,  , M ,  , X]   <- etc.
row 4-5: River (empty)
row 6: [x, ,m, , , ,m, ,x]
row 7: [ , ,s, , , ,s, , ]
row 8: [ , , , , , , , , ]
row 9: [ , , ,ct, ,ct, , , ]
```

### 3.3 Board as JSON

```json
{
  "board": [
    [null, null, null, "CT", null, "CT", null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, "S", null, "S", null, null, null],
    ["X", null, "M", null, null, null, "M", null, "X"],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    ["x", null, "m", null, null, null, "m", null, "x"],
    [null, null, "s", null, null, null, "s", null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, "ct", null, "ct", null, null, null]
  ]
}
```

**Note**: Lowercase = black pieces, Uppercase = red pieces
- `CT`/`ct` = Commander (Sâm)
- `S`/`s` = Advisor (Sĩ)
- `X`/`x` = Minister (Xe)
- `M`/`m` = Horse (Mã)
- `P`/`p` = Cannon (Pháo)
- `T`/`t` = Soldier (Tốt)

---

## 4. Query Patterns & Indexes

### 4.1 Common Queries

| Query | Collection | Index Used |
|-------|-----------|------------|
| Get game by roomId | games | `roomId` |
| Get game by roomCode | games | `roomCode` (unique) |
| List active games | games | `status_1, createdAt_-1` |
| Get player's games | games | `players.red.id` or `players.black.id` |
| Get room by code | rooms | `roomCode` (unique) |
| List public waiting rooms | rooms | `isPrivate_1, status_1` |
| Get player stats | players | `anonId` (unique) |
| Leaderboard | players | `elo` (descending) |

### 4.2 TTL (Auto-Delete) Indexes

```python
# Games: delete after 90 days of being finished
games.create_index("updatedAt", expireAfterSeconds=90*24*3600)

# Rooms: delete after 7 days of being closed/empty
rooms.create_index("updatedAt", expireAfterSeconds=7*24*3600)
```

---

## 5. Data Migration Strategy

### 5.1 Schema Evolution

- Use optional fields with defaults for backward compatibility
- Add new fields without breaking existing documents
- For breaking changes, use migration scripts

### 5.2 Example: Adding new field

```python
# New field with default value
class GameDocument(BaseModel):
    # ... existing fields ...
    newField: Optional[str] = None  # Optional, defaults to None

# Migration to set default for existing docs
async def migrate_add_new_field():
    await db.games.update_many(
        {"newField": {"$exists": False}},
        {"$set": {"newField": "default_value"}}
    )
```

---

## 6. Data Retention

| Data Type | Retention | Auto-Delete |
|----------|-----------|-------------|
| Active games (status=playing) | Until finished | No |
| Finished games | 90 days | Yes (TTL index) |
| Rooms (waiting) | 7 days after last activity | Yes (TTL index) |
| Closed/empty rooms | 7 days | Yes (TTL index) |
| Player stats | Indefinite | No |
| Move history | Embedded in game doc | Same as parent game |