from fastapi import APIRouter, HTTPException
from typing import Optional
from src.models.game import GameCreate, GameResponse, MoveRequest, Side, GameStatus

router = APIRouter()

# In-memory game storage
games_db = {}

def create_initial_board():
    # Simplified board setup
    board = [[None for _ in range(9)] for _ in range(10)]

    # Black pieces (row 0 at top)
    board[0][3] = "CT"  # Sâm at d1
    board[0][5] = "CT"  # Sâm at f1
    board[1][1] = "P"   # Cannon at b2
    board[1][7] = "P"   # Cannon at h2
    board[2][3] = "S"   # Advisor at d2
    board[2][5] = "S"   # Advisor at f2
    board[3][0] = "X"   # Minister at a1
    board[3][2] = "M"   # Horse at c1
    board[3][6] = "M"   # Horse at g1
    board[3][8] = "X"   # Minister at i1
    board[4][0] = "t"   # Soldier at a3
    board[4][2] = "t"   # Soldier at c3
    board[4][4] = "t"   # Soldier at e3
    board[4][6] = "t"   # Soldier at g3
    board[4][8] = "t"   # Soldier at i3

    # Red pieces (row 9 at bottom)
    board[9][4] = "CT"  # Sâm at e10
    board[8][1] = "p"   # Cannon at b9
    board[8][7] = "p"   # Cannon at h9
    board[7][3] = "s"   # Advisor at d8
    board[7][5] = "s"   # Advisor at f8
    board[6][0] = "x"   # Minister at a4
    board[6][2] = "m"   # Horse at c5
    board[6][6] = "m"   # Horse at g5
    board[6][8] = "x"   # Minister at i4
    board[5][0] = "T"   # Soldier at a6
    board[5][2] = "T"   # Soldier at c6
    board[5][4] = "T"   # Soldier at e6
    board[5][6] = "T"   # Soldier at g6
    board[5][8] = "T"   # Soldier at i6

    return board

@router.post("/", response_model=GameResponse)
async def create_game(data: GameCreate):
    from src.routers.rooms import rooms_db

    if data.room_code not in rooms_db:
        raise HTTPException(status_code=404, detail="Room not found")

    room = rooms_db[data.room_code]
    if room["status"] != "waiting":
        raise HTTPException(status_code=400, detail="Game already started")

    # Create game
    game_id = f"game_{data.room_code}"
    game = {
        "id": game_id,
        "room_code": data.room_code,
        "players": room["players"],
        "board": create_initial_board(),
        "current_turn": "red",
        "move_history": [],
        "status": "playing",
        "winner": None,
        "end_condition": None
    }

    games_db[game_id] = game
    room["status"] = "playing"
    room["game_id"] = game_id

    return GameResponse(
        id=game["id"],
        room_code=game["room_code"],
        players=game["players"],
        board=game["board"],
        current_turn=game["current_turn"],
        move_history=game["move_history"],
        status=GameStatus.PLAYING,
        winner=None,
        end_condition=None
    )

@router.get("/{game_id}", response_model=GameResponse)
async def get_game(game_id: str):
    if game_id not in games_db:
        raise HTTPException(status_code=404, detail="Game not found")

    g = games_db[game_id]
    return GameResponse(
        id=g["id"],
        room_code=g["room_code"],
        players=g["players"],
        board=g["board"],
        current_turn=g["current_turn"],
        move_history=g["move_history"],
        status=g["status"],
        winner=g.get("winner"),
        end_condition=g.get("end_condition")
    )

@router.post("/{game_id}/move")
async def make_move(game_id: str, data: MoveRequest):
    if game_id not in games_db:
        raise HTTPException(status_code=404, detail="Game not found")

    game = games_db[game_id]

    # Find player side
    player_side = None
    for side, player in game["players"].items():
        if player and player["id"] == data.player_id:
            player_side = side
            break

    if not player_side:
        raise HTTPException(status_code=403, detail="Player not in game")

    if game["current_turn"] != player_side:
        raise HTTPException(status_code=400, detail="Not your turn")

    # Simple move validation would go here
    # For now, just record the move
    move_record = {
        "moveNumber": len(game["move_history"]) + 1,
        "from_coord": data.from_pos,
        "to_coord": data.to_pos,
        "piece": player_side[0].upper(),
        "timestamp": "2024-01-01T00:00:00Z"
    }

    game["move_history"].append(move_record)

    # Switch turn
    game["current_turn"] = "black" if player_side == "red" else "red"

    return {
        "success": True,
        "game": GameResponse(
            id=game["id"],
            room_code=game["room_code"],
            players=game["players"],
            board=game["board"],
            current_turn=game["current_turn"],
            move_history=game["move_history"],
            status=game["status"],
            winner=game.get("winner"),
            end_condition=game.get("end_condition")
        )
    }

@router.post("/{game_id}/resign")
async def resign_game(game_id: str, player_id: str):
    if game_id not in games_db:
        raise HTTPException(status_code=404, detail="Game not found")

    game = games_db[game_id]

    # Find player side
    player_side = None
    for side, player in game["players"].items():
        if player and player["id"] == player_id:
            player_side = side
            break

    if not player_side:
        raise HTTPException(status_code=403, detail="Player not in game")

    game["status"] = "finished"
    game["winner"] = "black" if player_side == "red" else "red"
    game["end_condition"] = "resignation"

    return {
        "success": True,
        "winner": game["winner"]
    }