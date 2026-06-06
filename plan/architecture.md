# co-tuong-sat — Container Architecture

> **C4 Level**: 2 — Container/Application Architecture

## 1. Monorepo Structure

```
co-tuong-sat/
├── apps/
│   ├── web/                    # Next.js 14 frontend (TypeScript)
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router pages
│   │   │   │   ├── page.tsx            # Landing/Lobby page
│   │   │   │   ├── layout.tsx           # Root layout
│   │   │   │   └── game/
│   │   │   │       └── [roomId]/
│   │   │   │           └── page.tsx     # Game room page
│   │   │   ├── components/    # React components
│   │   │   │   ├── ui/         # Generic UI primitives
│   │   │   │   └── game/       # Game-specific components
│   │   │   ├── lib/           # Utilities
│   │   │   │   ├── engine/    # Pure game logic (no React deps)
│   │   │   │   ├── ws/        # WebSocket client
│   │   │   │   └── api/       # REST API client
│   │   │   └── styles/        # Global CSS
│   │   ├── public/            # Static assets
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── api/                   # FastAPI backend (Python)
│       ├── src/
│       │   ├── main.py                 # FastAPI app entry
│       │   ├── routers/
│       │   │   ├── rooms.py            # Room CRUD endpoints
│       │   │   ├── games.py            # Game CRUD endpoints
│       │   │   └── ws.py               # WebSocket endpoints
│       │   ├── services/
│       │   │   ├── game_service.py    # Game business logic
│       │   │   ├── move_validator.py   # Move validation engine
│       │   │   └── ai_service.py       # AI opponent logic
│       │   ├── models/
│       │   │   ├── game.py             # Pydantic models
│       │   │   └── room.py
│       │   ├── db/
│       │   │   └── mongodb.py          # Database connection
│       │   └── core/
│       │       ├── config.py           # Settings
│       │       └── exceptions.py       # Custom exceptions
│       ├── tests/
│       │   ├── test_move_validator.py
│       │   └── test_ai.py
│       ├── requirements.txt
│       └── pyproject.toml
│
├── packages/
│   └── shared/                  # Shared types (if needed)
│       └── types.ts            # TypeScript types for shared structures
│
├── bun.lockb                    # Bun workspace lockfile
├── package.json                 # Root package.json (workspace config)
└── README.md
```

---

## 2. Frontend Architecture (apps/web)

### 2.1 Pages/Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | SSG | Landing page with lobby, create/join room buttons |
| `/game/[roomId]` | CSR | Main game page with real-time board |
| `/api/rooms` | API Route (via FastAPI) | REST proxy to backend |
| `/api/games/[gameId]` | API Route | REST proxy to backend |

### 2.2 Component Hierarchy

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Lobby (SSG)
│   ├── game/
│   │   └── [roomId]/
│   │       └── page.tsx       # Game room (client component)
│   └── globals.css
│
├── components/
│   ├── ui/                     # Generic UI primitives
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Avatar.tsx
│   │
│   └── game/                   # Game-specific UI
│       ├── GameBoard.tsx        # Main 9x10 board component
│       ├── Piece.tsx           # Individual piece (SVG + label)
│       ├── PlayerPanel.tsx     # Player info panel
│       ├── MoveHistory.tsx     # Move list display
│       ├── RoomCard.tsx        # Room listing card
│       ├── PromotionModal.tsx  # Sâm promotion dialog
│       └── GameOverModal.tsx   # Result display
│
├── lib/
│   ├── engine/                 # Pure game logic (no React deps)
│   │   ├── types.ts           # TypeScript types
│   │   ├── constants.ts       # Board size, piece values
│   │   ├── board.ts           # Board initialization
│   │   ├── moves.ts           # Move generation
│   │   ├── validation.ts      # Move validation
│   │   ├── check.ts           # Check/checkmate detection
│   │   └── notation.ts        # Board notation conversion
│   │
│   ├── ws/                     # WebSocket client
│   │   └── client.ts          # WS connection manager
│   │
│   └── api/                    # REST client
│       └── client.ts           # Fetch wrapper
│
└── hooks/
    ├── useGameState.ts         # Game state management
    ├── useWebSocket.ts         # WS connection hook
    └── useAI.ts               # AI move calculation
```

### 2.3 State Management Approach

- **Server State**: React Query (@tanstack/react-query) for API data fetching + caching
- **Client State**: React useState/useReducer for UI state
- **Game State**: Synchronized via WebSocket, stored in MongoDB
- **URL State**: Room ID in URL path for shareability

---

## 3. Backend Architecture (apps/api)

### 3.1 API Endpoints

#### Room Management
```
POST /api/rooms
  Create new room
  Request: { "name": "string", "isPrivate": boolean }
  Response: { "id": "string", "roomCode": "string", ... }

GET /api/rooms
  List public rooms
  Response: { "rooms": [...] }

GET /api/rooms/{roomId}
  Get room details
  Response: { "id", "name", "players", "status", "gameId" }

DELETE /api/rooms/{roomId}
  Close room (host only)
```

#### Game Management
```
POST /api/games
  Create new game in room
  Request: { "roomId": "string", "playerId": "string", "playerName": "string" }
  Response: { "id": "string", "board": [...], "status": "playing" }

GET /api/games/{gameId}
  Get game state
  Response: { full game state object }

POST /api/games/{gameId}/move
  Submit a move
  Request: { "playerId": "string", "from": "string", "to": "string" }
  Response: { "success": boolean, "game": {...}, "error"?: string }

POST /api/games/{gameId}/resign
  Player resigns
  Request: { "playerId": "string" }
  Response: { "winner": "string" }
```

#### WebSocket
```
WS /ws/{roomId}/{playerId}
  Real-time game updates
  Messages:
    - { "type": "MOVE", "from": "I10", "to": "I9" }
    - { "type": "JOIN", "playerId": "...", "playerName": "..." }
    - { "type": "LEAVE", "playerId": "..." }
    - { "type": "GAME_STATE", "data": {...} }
    - { "type": "GAME_OVER", "winner": "red", "reason": "checkmate" }
```

### 3.2 Data Models

#### Game State (MongoDB Document)
```python
{
  "_id": ObjectId,
  "roomId": ObjectId,
  "roomCode": "ABC123",
  "players": {
    "red": { "id": "uuid", "name": "Minh", "connected": true },
    "black": { "id": "uuid", "name": "Anh", "connected": true }
  },
  "board": [  # 10 rows x 9 cols
    [null, null, ..., null],  # row 0
    ...
    [null, null, ..., null]   # row 9
  ],
  "currentTurn": "red",
  "moveHistory": [
    { "moveNumber": 1, "from": "I10", "to": "I9", "piece": "c", "captured": null, "timestamp": "..." }
  ],
  "status": "waiting | playing | finished",
  "winner": "red | black | draw",
  "endCondition": "checkmate | resignation | sâm-sacrifice | draw",
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

#### Room Document
```python
{
  "_id": ObjectId,
  "roomCode": "ABC123",  # 6-char uppercase alphanumeric
  "name": "Phòng của Minh",
  "isPrivate": false,
  "status": "waiting | playing | closed",
  "hostPlayerId": "uuid",
  "createdAt": DateTime
}
```

#### Player Stats Document
```python
{
  "_id": ObjectId,
  "anonId": "uuid-from-localStorage",
  "displayName": "Player123",
  "elo": 1200,
  "gamesPlayed": 45,
  "gamesWon": 23,
  "gamesLost": 20,
  "gamesDrawn": 2,
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

---

## 4. Real-time Communication Design

### 4.1 WebSocket Flow

```
Client A (Red)                Server (FastAPI)                Client B (Black)
    |                              |                              |
    |--- connect WS --------------->|                              |
    |<-- confirm connected ---------|                              |
    |                              |<-------- connect WS ----------|
    |                              |------ confirm connected ----->|
    |                              |                              |
    | [Red moves piece]            |                              |
    |--- MOVE {from, to} --------->|                              |
    |                              | [Validate move]               |
    |                              | [Update board in MongoDB]     |
    |<-- GAME_STATE update ---------|                              |
    |                              |------ GAME_STATE broadcast -->|
    |                              |                              | (Board updates)
    |                              |                              |
```

### 4.2 Message Types

```typescript
type WSMessage =
  | { type: 'MOVE'; playerId: string; from: string; to: string }
  | { type: 'JOIN'; playerId: string; playerName: string; side: 'red' | 'black' }
  | { type: 'LEAVE'; playerId: string }
  | { type: 'GAME_STATE'; game: GameState }
  | { type: 'GAME_OVER'; winner: 'red' | 'black'; reason: string }
  | { type: 'ERROR'; message: string }
  | { type: 'PING' | 'PONG' }  // Heartbeat
```

### 4.3 Reconnection Strategy

- On disconnect: show "Reconnecting..." banner
- Exponential backoff: 1s, 2s, 4s, 8s, max 30s
- On reconnect: request full game state from server
- If room no longer exists: redirect to lobby with message

---

## 5. Deployment Architecture

```
┌─────────────────────────────────────────┐
│           GitHub Repository              │
│    mjnhlyxa / co-tuong-sat             │
└────────────────┬────────────────────────┘
                 │ git push
                 ▼
┌─────────────────────────────────────────┐
│         Vercel (GitHub Integration)      │
│                                          │
│  Frontend: https://co-tuong-sat.vercel.app│
│  Auto-deploy on main branch push         │
│                                          │
│  API: Deployed as serverless functions  │
│  via monorepo support                   │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                ▼
┌──────────────┐  ┌─────────────────────┐
│  MongoDB     │  │   Vercel Edge       │
│  10.60.184.61│  │   Cache             │
│  :27017      │  │                     │
└──────────────┘  └─────────────────────┘
```

Note: FastAPI backend runs on Vercel serverless functions (Python support required). If Vercel doesn't support Python, use a separate hosting for the API (e.g., Railway, Render, or a VPS).

---

## 6. Environment Configuration

### Backend (.env)
```
MONGODB_URL=mongodb://10.60.184.61:27017
MONGODB_DB=co_tuong_sam
CORS_ORIGINS=https://co-tuong-sat.vercel.app,http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://co-tuong-sat-api.vercel.app
NEXT_PUBLIC_WS_URL=wss://co-tuong-sat-api.vercel.app/ws
```