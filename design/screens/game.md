# Game Screen

**Route**: `/game/[roomCode]`
**Purpose**: Main gameplay interface

## Layout (Desktop, 1024px+)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Lobby   Room: ABC123                              [Rules] [Menu]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─ Black Player ───────────────────────────────────────────────┐  │
│  │  [Avatar]  Anh                              [Captured: P T]   │  │
│  │            ● Waiting...                                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │     a   b   c   d   e   f   g   h   i                        │  │
│  │   ┌───┬───┬───┬───┬───┬───┬───┬───┬───┐                    │  │
│  │ 10 │   │   │   │CT │   │CT │   │   │   │ ← Black palace     │  │
│  │   ├───┼───┼───┼───┼───┼───┼───┼───┼───┤                    │  │
│  │  9 │   │   │   │   │   │   │   │   │   │                    │  │
│  │   ├───┼───┼───┼───┼───┼───┼───┼───┼───┤                    │  │
│  │  8 │   │   │   │ S │   │ S │   │   │   │                    │  │
│  │   ├───┼───┼───┼───┼───┼───┼───┼───┼───┤                    │  │
│  │  7 │ X │   │ M │   │   │   │ M │   │ X │                    │  │
│  │   ├───┼───┼───┼───┼───┼───┼───┼───┼───┤                    │  │
│  │  6 │   │   │   │   │   │   │   │   │   │                    │  │
│  │   ╞═══╪═══╪═══╪═══╪═══╪═══╪═══╪═══╪═══╡ ← River           │  │
│  │  5 │   │   │   │   │   │   │   │   │   │                    │  │
│  │   ├───┼───┼───┼───┼───┼───┼───┼───┼───┤                    │  │
│  │  4 │   │   │   │   │   │   │   │   │   │                    │  │
│  │   ├───┼───┼───┼───┼───┼───┼───┼───┼───┤                    │  │
│  │  3 │ x │   │ m │   │   │   │ m │   │ x │                    │  │
│  │   ├───┼───┼───┼───┼───┼───┼───┼───┼───┤                    │  │
│  │  2 │   │   │ s │   │   │   │ s │   │   │                    │  │
│  │   ├───┼───┼───┼───┼───┼───┼───┼───┼───┤                    │  │
│  │  1 │   │   │   │ct │   │ct │   │   │   │                    │  │
│  │   └───┴───┴───┴───┴───┴───┴───┴───┴───┘                    │  │
│  │     a   b   c   d   e   f   g   h   i                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─ Red Player ──────────────────────────────────────────────────┐  │
│  │  [Avatar]  Minh                              [Captured: ]     │  │
│  │            Your turn ●                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─ Move History ──────────────────────┐  ┌─ Actions ─────────┐  │
│  │ 1. red: CT d1 → d2                  │  │                   │  │
│  │ 2. black: ct b0 → b1                 │  │  [Resign]          │  │
│  │ 3. red: S d3 → e4                   │  │  [Offer Draw]      │  │
│  └─────────────────────────────────────┘  └───────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Layout (Mobile, 375px)

```
┌────────────────────────────────┐
│  ← Lobby    Room: ABC123       │
├────────────────────────────────┤
│  ┌──────────────────────────┐ │
│  │  [Avatar] Anh            │ │
│  │  ● Waiting... [P ]        │ │
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │     9x10 GAME BOARD      │ │
│  │     (Full width)         │ │
│  │                          │ │
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │  [Avatar] Minh  ● You    │ │
│  │  [T ]                    │ │
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │ 1. CT d1→d2  2. ct b0→b1 │ │
│  │ 3. S d3→e4               │ │
│  └──────────────────────────┘ │
│                                │
│  [Resign]           [Draw]    │
└────────────────────────────────┘
```

## Elements

| Element | Description | Behavior |
|---------|-------------|----------|
| Back Button | "← Lobby" link | Returns to home (with confirmation if in game) |
| Room Code | Display room code | Click to copy share link |
| Rules Button | "?" icon | Opens rules modal |
| Menu Button | "☰" icon | Opens game menu |
| Black Player Panel | Shows name, status, captured pieces | — |
| Red Player Panel | Shows name, status, captured pieces | — |
| Game Board | 9x10 grid with pieces | Primary interaction area |
| Piece | Circular piece with label | Click to select/move |
| Valid Move Indicator | Green dot overlay | Shows valid destinations |
| Move History | Scrollable list | Click to jump to position |
| Resign Button | Secondary button | Confirm → opponent wins |
| Draw Button | Secondary button | Offer/accept draw |

## States

### Waiting for Opponent
- Board visible but dimmed
- "Waiting for opponent..." message
- Can leave room

### Your Turn
- Turn indicator shows "Your turn"
- Your pieces are clickable
- Opponent pieces are visible but not clickable

### Opponent's Turn
- Turn indicator shows "Waiting..."
- No pieces are clickable
- Brief delay before opponent moves

### Check
- King piece has red pulsing glow
- "Check!" indicator appears
- Player must resolve check

### Checkmate
- Game freezes
- Winner announcement overlay

## Key Interactions

### Selecting a Piece
1. Click on your piece (if it's your turn)
2. Piece highlights with gold ring
3. Valid move dots appear on valid destinations
4. Click another of your pieces → change selection

### Making a Move
1. Select piece (see valid moves)
2. Click valid destination square
3. Piece animates to new position
4. If capture: captured piece fades with shake
5. Move sent to server
6. Turn changes

### Capture
1. Move to square containing enemy piece
2. Enemy piece removed (fade + shake animation)
3. Your piece moves to square
4. If this causes check, show check indicator

### Sâm Sacrifice (Special Win)
1. When your Sâm is in checkmate (no legal moves)
2. You can sacrifice Sâm to capture opponent's King
3. Special golden animation plays
4. Immediate win declared

---

## Component Inventory

### PlayerPanel
- Shows: Avatar (first letter), name, side color
- Shows: Turn indicator (● for current turn)
- Shows: Captured pieces (small piece icons)
- States: waiting, active, winner, disconnected

### GameBoard
- 9x10 CSS grid
- River line between row 4-5
- Palace corner markers
- Coordinate labels (a-i, 1-10)
- Click handler for all cells

### Piece
- Circular, 40px desktop / 32px mobile
- Side-colored (red/black)
- Label: CT, S, X, M, P, T
- States: default, selected (gold ring), valid-target (green dot), last-move (highlight), in-check (red pulse)

### ValidMoveIndicator
- Small dot (12px) centered in valid squares
- Green for normal moves
- Red ring for capture moves
- Pulse animation for single option

### MoveHistory
- Scrollable list
- Format: "1. red: CT d1 → d2"
- Click to replay from that position

### ActionButtons
- Resign: secondary/danger
- Draw: secondary

### GameOverModal
- Large winner text
- End condition explanation
- Rematch / Share / Back to Lobby buttons