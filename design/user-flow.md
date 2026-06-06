# co-tuong-sat — User Flow

## Flow Diagram

```
[Landing / Lobby]
        │
        ├── [Create Room] ───→ [Room Waiting] ──(opponent joins)──→ [Game Playing]
        │                           │                                      │
        │                           │                                     │
        │                           │←──────────── [Rematch] ─────────────┤
        │                           │                                     │
        ├── [Join Room] ───→ [Room Waiting] ──(opponent joins)──→ [Game Playing]
        │         │                                                        │
        │         │                                                        │
        │         └── [Invalid Code] → [Error Toast] → [Back to Lobby]    │
        │                                                                    │
        ├── [Play vs AI] ─────────────────────→ [Game Playing vs AI] ────→ [Game Over]
        │                                             │                       │
        │                                             │                       ├── [Play Again vs AI]
        │                                             │                       ├── [Rematch]
        │                                             │                       └── [Back to Lobby]
        │                                                                    │
        └── [How to Play] ───→ [Rules Modal] ───────────────→ [Close] ─────┘

[Game Playing] ──(game ends)──→ [Game Over Screen]
                                    │
                                    ├── [Rematch] ────────→ [Game Playing]
                                    ├── [Share Result]
                                    └── [Back to Lobby]
```

---

## Screen Descriptions

### 1. Landing / Lobby (`/`)

**What user sees:**
- Game logo and title at top
- Large "Play vs AI" button (primary action)
- "Create Room" and "Join Room" buttons (secondary)
- Public rooms list (if any exist)
- "How to Play" help button

**Actions available:**
| Action | Destination |
|--------|-------------|
| "Play vs AI" | Game vs AI immediately |
| "Create Room" | Opens room creation modal |
| "Join Room" | Opens room code input modal |
| Click room in list | Join that room (if waiting) |
| "How to Play" | Opens rules modal |

---

### 2. Room Waiting (`/game/[roomCode]`)

**What user sees:**
- Room name and code prominently displayed
- "Waiting for opponent..." message
- Share link button
- Your side indicator (red or black)
- Cancel button to return to lobby

**Actions available:**
| Action | Destination |
|--------|-------------|
| Copy share link | Copy to clipboard toast |
| Cancel | Back to lobby (with confirmation if game started) |

**Transitions:**
- Opponent joins → immediately start game
- Host leaves → room closed, other player returns to lobby

---

### 3. Game Playing (`/game/[roomCode]`)

**What user sees:**
- 9x10 board with pieces in initial positions
- Your side's pieces highlighted at bottom (red) or top (black)
- Player panels on sides showing names and captured pieces
- Move history list
- Turn indicator ("Your turn" / "Waiting...")

**During game:**
| Action | Result |
|--------|--------|
| Click your piece | Select piece, show valid moves |
| Click valid destination | Move piece, send to server |
| Click opponent piece (when selected) | Capture if valid |
| Click own piece (when selected) | Change selection |
| Click empty (when selected) | Move to if valid |
| Escape key | Deselect current piece |

**After move:**
- Server validates
- Board updates
- Opponent's turn begins

---

### 4. Game Over (`/game/[roomCode]`)

**What user sees:**
- Overlay modal on board
- Winner announcement (Red Wins / Black Wins / Draw)
- End condition (Checkmate, Sâm Sacrifice, Resignation, Draw)
- Move count

**Actions available:**
| Action | Destination |
|--------|-------------|
| Rematch | New game same opponent |
| Share Result | Copy game link to clipboard |
| Back to Lobby | Return to home page |

---

### 5. Rules Modal (`How to Play`)

**What user sees:**
- Board diagram showing piece setup
- Movement rules for each piece type
- Special rules (river crossing, Sâm sacrifice)
- Win conditions

**Navigation:**
- Close button → return to previous screen
- Click outside modal → close

---

## User Flow Detail

### Flow 1: Anonymous vs AI
```
1. Open URL → Landing page
2. Click "Play vs AI" → AI selection screen (choose red/black)
3. Select side → Game starts, you are red (bottom)
4. Make move → AI responds after 1-2 seconds
5. Game ends → Game Over screen
6. Click "Play Again" → New game vs AI
   OR click "Back to Lobby" → Landing page
```

### Flow 2: Multiplayer Room
```
1. Open URL → Landing page
2. Click "Create Room" → Modal opens
3. Enter room name → Click "Create"
4. Room Waiting screen → Copy link to share
5. Friend opens link → Joins room → Game starts
6. Play game → Game Over screen
7. Click "Rematch" → New game
   OR "Back to Lobby" → Landing page
```

### Flow 3: Multiplayer Join
```
1. Open URL → Landing page
2. Click "Join Room" → Modal opens
3. Enter 6-character code → Click "Join"
4. If valid + waiting → Game starts
   If invalid → Error toast → retry
   If full/playing → Redirect to spectate or error
```

---

## State Transitions

```
                    ┌─────────────┐
                    │   LOBBY     │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │ vs AI   │      │ CREATE   │      │  JOIN    │
    │         │      │ ROOM     │      │  ROOM    │
    └────┬────┘      └────┬─────┘      └────┬─────┘
         │                │                 │
         ▼                │                 │
    ┌──────────┐         │                 │
    │ GAME     │         │                 │
    │ vs AI    │         │                 │
    └────┬────┘         │                 │
         │                │                 │
         ▼                ▼                 ▼
    ┌──────────┐    ┌───────────┐    ┌───────────┐
    │GAME OVER │    │ ROOM     │    │ GAME      │
    │          │    │ WAITING  │    │ STARTED   │
    └────┬─────┘    └─────┬─────┘    └─────┬─────┘
         │                │                │
         │                │                │
         ▼                └────────┬──────┘
    ┌──────────┐                   │
    │ LOBBY   │◄────────────────────┘
    │ (loop)  │
    └─────────┘
```

---

## Edge Cases

### Empty States
- **No public rooms**: Show "No rooms available. Create one!" message
- **No move history yet**: Show "No moves yet. Make your first move!"
- **Loading**: Show spinner with "Loading..." text

### Error States
- **Invalid room code**: Toast "Room not found" → return to lobby
- **Connection lost**: Banner "Connection lost. Reconnecting..." → auto-retry
- **Game full**: Toast "Room is full" → return to lobby

### Timeout Handling
- **Opponent disconnected**: Show "Opponent disconnected. Waiting..." → 60s timeout → win by default