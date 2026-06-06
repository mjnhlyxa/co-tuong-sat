# Lobby / Home Screen

**Route**: `/`
**Purpose**: Landing page — let users start playing immediately

## Layout (Desktop, 1024px+)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo]  co-tuong-sat                         [?] How to Play        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                                                                      │
│      ┌────────────────────────────────────────────────────────┐      │
│      │                                                        │      │
│      │              [Board Preview - Small]                   │      │
│      │                                                        │      │
│      └────────────────────────────────────────────────────────┘      │
│                                                                      │
│      ┌─────────────────────┐    ┌─────────────────────┐            │
│      │                     │    │                     │            │
│      │    PLAY VS AI       │    │    CREATE ROOM      │            │
│      │    [Start Game]     │    │    Room name: ...   │            │
│      │                     │    │    [Create]          │            │
│      │                     │    │                     │            │
│      └─────────────────────┘    └─────────────────────┘            │
│                                                                      │
│      ┌────────────────────────────────────────────────────────┐      │
│      │  JOIN ROOM                                             │      │
│      │  [ ][ ][ ][ ][ ][ ]  (6-char code input)               │      │
│      │  [Join]                                                │      │
│      └────────────────────────────────────────────────────────┘      │
│                                                                      │
│      ─────────────── PUBLIC ROOMS ───────────────                   │
│      ┌────────────────────────────────────────────────────────┐      │
│      │ No rooms available. Create one!                         │      │
│      └────────────────────────────────────────────────────────┘      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Layout (Mobile, 375px)

```
┌────────────────────────────────┐
│  co-tuong-sat        [?]       │
├────────────────────────────────┤
│                                │
│   [Small Board Preview]        │
│                                │
│   ┌────────────────────────┐   │
│   │      PLAY VS AI        │   │
│   │      [Start Game]      │   │
│   └────────────────────────┘   │
│                                │
│   ┌────────────────────────┐   │
│   │      CREATE ROOM        │   │
│   │   [________________]    │   │
│   │      [Create]           │   │
│   └────────────────────────┘   │
│                                │
│   ┌────────────────────────┐   │
│   │      JOIN ROOM          │   │
│   │   [ ][ ][ ][ ][ ][ ]   │   │
│   │      [Join]             │   │
│   └────────────────────────┘   │
│                                │
│   ─── PUBLIC ROOMS ───         │
│   ┌────────────────────────┐   │
│   │ Room A | ABC123 | 1/2   │   │
│   │ [Join]                  │   │
│   └────────────────────────┘   │
│                                │
└────────────────────────────────┘
```

## Elements

| Element | Description | Behavior |
|---------|-------------|----------|
| Logo | "co-tuong-sat" text or icon | Non-interactive, branding |
| Board Preview | Mini 9x10 board with pieces | Static decorative |
| Play vs AI Button | Large gold button | Click → AI side selection |
| Create Room Button | Secondary button | Click → open room creation form |
| Room Name Input | Text input | Type room name (optional) |
| Join Room Input | 6 separate character boxes | Auto-advance, uppercase |
| Join Button | Gold button | Validates code → join room |
| Public Rooms List | Scrollable list | Show waiting rooms |
| Room Card | Shows room name, code, player count | Click → join if waiting |
| How to Play Button | "?" icon | Opens rules modal |

## States

### Default (No Rooms)
- Public rooms section shows "No rooms available. Create one!"
- List is empty, not an error

### With Rooms
- Rooms listed as cards with: name, code, player count (1/2 or 2/2), status
- "Waiting" rooms have green badge and Join button enabled
- "Playing" rooms have yellow badge and "In Game" label, Join disabled

### Loading
- Buttons show spinner
- "Loading rooms..." text

### Error
- Toast notification for errors (room not found, join failed)
- Red border on join input

## Key Interactions

### Play vs AI
1. Click "Play vs AI" button
2. Modal opens: "Choose your side"
   - Red (bottom) / Black (top) / Random
3. Select side → Game starts immediately

### Create Room
1. Fill optional room name
2. Click "Create"
3. Redirect to Room Waiting screen with shareable link

### Join Room
1. Enter 6-character code (auto-uppercase)
2. Or paste full URL
3. Click "Join"
4. If valid: redirect to game
5. If invalid: show error toast

---

## Component Inventory

### Logo
- Text "co-tuong-sat" in Playfair Display
- Gold accent color
- Non-interactive

### Board Preview (Decorative)
- Small (200px) static board
- Shows initial piece positions
- Non-interactive, purely decorative

### PrimaryButton
- States: default, hover, active, disabled, loading
- Used for: Play vs AI, Join, Create

### SecondaryButton
- Used for: Cancel, Back

### TextInput
- Used for: Room name input
- States: default, focused, error, disabled

### CodeInput (6 boxes)
- 6 individual character inputs
- Auto-advance cursor
- Uppercase only
- Paste support

### RoomCard
- Shows: room name, code (for sharing), player count, status
- States: waiting (green), playing (yellow), full (disabled)

### Modal
- Used for: side selection, rules, confirmations
- Overlay with backdrop blur
- Close on: X button, Escape, backdrop click