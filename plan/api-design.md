# co-tuong-sat — API Design

> **C4 Level**: 3 — Component Specification (API)

## 1. API Overview

**Base URL**: `https://co-tuong-sat-api.vercel.app/api` (or localhost for dev)

All endpoints return JSON. `Content-Type: application/json` for POST/PUT.
No authentication required — anonymous player ID passed in request body.

## 2. REST Endpoints

### 2.1 Room Endpoints

#### POST /api/rooms — Create Room

**Request:**
```json
{
  "name": "Phòng của Minh",
  "isPrivate": false,
  "playerId": "550e8400-e29b-41d4-a716-446655440000",
  "playerName": "Minh"
}
```

**Response (201):**
```json
{
  "success": true,
  "room": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "roomCode": "ABC123",
    "name": "Phòng của Minh",
    "isPrivate": false,
    "status": "waiting",
    "hostPlayerId": "550e8400-e29b-41d4-a716-446655440000",
    "players": {
      "red": { "id": "550e8400-e29b-41d4-a716-446655440000", "name": "Minh", "connected": true },
      "black": null
    },
    "shareUrl": "https://co-tuong-sat.vercel.app/game/ABC123"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "INVALID_REQUEST",
  "message": "Room name is required (max 50 chars)"
}
```

---

#### GET /api/rooms — List Public Rooms

**Response (200):**
```json
{
  "success": true,
  "rooms": [
    {
      "id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "roomCode": "ABC123",
      "name": "Phòng của Minh",
      "status": "waiting",
      "players": {
        "red": { "id": "550e8400-e29b-41d4-a716-446655440000", "name": "Minh" },
        "black": null
      },
      "createdAt": "2024-03-01T10:00:00Z"
    }
  ]
}
```

---

#### GET /api/rooms/{roomCode} — Get Room Details

**Response (200):**
```json
{
  "success": true,
  "room": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "roomCode": "ABC123",
    "name": "Phòng của Minh",
    "isPrivate": false,
    "status": "playing",
    "gameId": "65f1a2b3c4d5e6f7a8b9c0d2",
    "players": {
      "red": { "id": "550e8400-e29b-41d4-a716-446655440000", "name": "Minh", "connected": true },
      "black": { "id": "660e8400-e29b-41d4-a716-446655440001", "name": "Anh", "connected": true }
    },
    "createdAt": "2024-03-01T10:00:00Z"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "ROOM_NOT_FOUND",
  "message": "Room ABC123 does not exist"
}
```

---

#### DELETE /api/rooms/{roomCode} — Close Room

**Request:**
```json
{
  "playerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Room closed"
}
```

**Error (403):**
```json
{
  "success": false,
  "error": "NOT_HOST",
  "message": "Only the host can close the room"
}
```

---

### 2.2 Game Endpoints

#### POST /api/games — Create Game

Creates a new game in the specified room. Called automatically when second player joins.

**Request:**
```json
{
  "roomCode": "ABC123",
  "playerId": "660e8400-e29b-41d4-a716-446655440001",
  "playerName": "Anh"
}
```

**Response (201):**
```json
{
  "success": true,
  "game": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d2",
    "roomCode": "ABC123",
    "players": {
      "red": { "id": "550e8400-e29b-41d4-a716-446655440000", "name": "Minh", "connected": true },
      "black": { "id": "660e8400-e29b-41d4-a716-446655440001", "name": "Anh", "connected": true }
    },
    "board": [
      [null, null, null, "CT", null, "CT", null, null, null],
      // ... 10 rows total
    ],
    "currentTurn": "red",
    "moveHistory": [],
    "status": "playing",
    "createdAt": "2024-03-01T10:05:00Z"
  }
}
```

---

#### GET /api/games/{gameId} — Get Game State

**Response (200):**
```json
{
  "success": true,
  "game": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d2",
    "roomCode": "ABC123",
    "players": {
      "red": { "id": "550e8400-...", "name": "Minh", "connected": true },
      "black": { "id": "660e8400-...", "name": "Anh", "connected": true }
    },
    "board": [...],
    "currentTurn": "black",
    "moveHistory": [
      {
        "moveNumber": 1,
        "fromCoord": "i10",
        "toCoord": "i9",
        "piece": "ct",
        "capturedPiece": null,
        "isSacrifice": false,
        "timestamp": "2024-03-01T10:05:30Z"
      }
    ],
    "status": "playing",
    "winner": null,
    "endCondition": null
  }
}
```

---

#### POST /api/games/{gameId}/move — Submit Move

**Request:**
```json
{
  "playerId": "550e8400-e29b-41d4-a716-446655440000",
  "from": "i10",
  "to": "i9"
}
```

**Response (200):**
```json
{
  "success": true,
  "game": {
    // ... full updated game state
  },
  "move": {
    "moveNumber": 1,
    "fromCoord": "i10",
    "toCoord": "i9",
    "piece": "ct",
    "capturedPiece": null,
    "isSacrifice": false
  }
}
```

**Error (400 - Invalid Move):**
```json
{
  "success": false,
  "error": "INVALID_MOVE",
  "message": "Cannot move CT from i10 to i9 — movement not allowed for this piece type"
}
```

**Error (403 - Not Your Turn):**
```json
{
  "success": false,
  "error": "NOT_YOUR_TURN",
  "message": "It is currently black's turn, not red's"
}
```

---

#### POST /api/games/{gameId}/resign — Resign Game

**Request:**
```json
{
  "playerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "success": true,
  "game": {
    "status": "finished",
    "winner": "black",
    "endCondition": "resignation"
  }
}
```

---

#### POST /api/games/{gameId}/draw — Offer/Accept Draw

**Request:**
```json
{
  "playerId": "550e8400-e29b-41d4-a716-446655440000",
  "action": "offer" | "accept" | "reject"
}
```

**Response (200):**
```json
{
  "success": true,
  "drawOffered": true,
  "offeredBy": "red"
}
```

---

### 2.3 Player Endpoints

#### GET /api/players/{anonId} — Get Player Stats

**Response (200):**
```json
{
  "success": true,
  "player": {
    "anonId": "550e8400-e29b-41d4-a716-446655440000",
    "displayName": "Minh",
    "elo": 1250,
    "gamesPlayed": 45,
    "gamesWon": 23,
    "gamesLost": 20,
    "gamesDrawn": 2
  }
}
```

---

#### PUT /api/players/{anonId} — Update Player Name

**Request:**
```json
{
  "displayName": "MinhPro"
}
```

**Response (200):**
```json
{
  "success": true,
  "player": {
    "anonId": "550e8400-e29b-41d4-a716-446655440000",
    "displayName": "MinhPro",
    "elo": 1250
  }
}
```

---

## 3. WebSocket Endpoints

### 3.1 Connection

**Endpoint:** `WSS://api.example.com/ws/{roomCode}/{playerId}`

**Connection Flow:**
1. Client connects with room code and player ID
2. Server validates room exists and player is in game
3. Server sends `{ "type": "CONNECTED", "game": {...} }`
4. If game already in progress, server sends full game state

### 3.2 Client → Server Messages

```typescript
// Submit move
{ "type": "MOVE", "from": "i10", "to": "i9" }

// Offer draw
{ "type": "DRAW_OFFER" }

// Accept draw
{ "type": "DRAW_ACCEPT" }

// Reject draw
{ "type": "DRAW_REJECT" }

// Resign
{ "type": "RESIGN" }

// Heartbeat/ping
{ "type": "PING" }
```

### 3.3 Server → Client Messages

```typescript
// Full game state update (after any change)
{
  "type": "GAME_STATE",
  "game": {
    "board": [...],
    "currentTurn": "black",
    "moveHistory": [...],
    "status": "playing"
  }
}

// Move was applied
{
  "type": "MOVE_APPLIED",
  "move": {
    "moveNumber": 1,
    "from": "i10",
    "to": "i9",
    "piece": "ct"
  }
}

// Game over
{
  "type": "GAME_OVER",
  "winner": "red",
  "reason": "checkmate",
  "finalBoard": [...]
}

// Draw offered
{
  "type": "DRAW_OFFERED",
  "offeredBy": "black"
}

// Player disconnected
{
  "type": "PLAYER_DISCONNECTED",
  "playerId": "..."
}

// Player reconnected
{
  "type": "PLAYER_RECONNECTED",
  "playerId": "..."
}

// Error
{
  "type": "ERROR",
  "message": "Invalid move",
  "code": "INVALID_MOVE"
}

// Heartbeat response
{ "type": "PONG" }
```

---

## 4. Error Handling

### 4.1 Error Response Format

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {}  // Optional additional context
}
```

### 4.2 Error Codes

| HTTP Code | Error Code | Meaning |
|-----------|-----------|---------|
| 400 | INVALID_REQUEST | Malformed request body |
| 400 | INVALID_MOVE | Move validation failed (wrong movement, blocked path, etc.) |
| 400 | INVALID_COORDINATE | Board coordinate out of range |
| 403 | NOT_YOUR_TURN | Player trying to move out of turn |
| 403 | NOT_PLAYER_IN_GAME | Player ID not part of this game |
| 403 | GAME_NOT_ACTIVE | Game already finished |
| 403 | NOT_HOST | Only room host can perform this action |
| 404 | GAME_NOT_FOUND | Game ID does not exist |
| 404 | ROOM_NOT_FOUND | Room code does not exist |
| 409 | ROOM_FULL | Cannot join — room already has 2 players |
| 409 | GAME_ALREADY_STARTED | Cannot join — game already in progress |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## 5. Request/Response Examples

### 5.1 Full Game Flow

```
1. POST /api/rooms → Create room, get roomCode "ABC123"
2. GET /api/rooms → See room "ABC123" in list
3. Second player: POST /api/games with roomCode "ABC123" → Game created
4. GET /api/games/{gameId} → Get initial board state
5. WS connection established for real-time updates
6. Red player: POST /api/games/{gameId}/move → Move applied, broadcast via WS
7. Black player receives MOVE_APPLIED via WS
8. Repeat until checkmate or resignation
9. GAME_OVER sent via WS to both players
```

### 5.2 AI Game Flow

```
1. POST /api/rooms → Create room for vs AI
2. Player joins room (becomes red)
3. POST /api/games → Game created
4. Instead of second human, AI makes moves via automated playerId
5. Player vs AI: AI moves every 2 seconds after player moves
```

---

## 6. Rate Limiting

- **API Routes**: 100 requests/minute per IP
- **WebSocket**: 60 messages/minute per connection
- **Exceeded**: Return 429 with `Retry-After` header

---

## 7. Validation Rules

### 7.1 Room Name
- Required, 1-50 characters
- No special characters except spaces and hyphens

### 7.2 Move Coordinates
- Format: lowercase letter + number (e.g., "a1", "i10")
- Column: a-i (0-8)
- Row: 1-10 (1 = top, 10 = bottom)
- Converted to internal 0-indexed before validation

### 7.3 Player ID
- UUID v4 format
- Must exist in game players list

### 7.4 Board Position
- Row: 0-9 (0 = top/black side, 9 = bottom/red side)
- Column: 0-8 (0 = left/a, 8 = right/i)