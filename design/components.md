# co-tuong-sat — Components Specification

> Complete list of reusable components with variants and states

---

## Generic UI Components

### Button

**Purpose**: Primary interaction element
**Used on**: Lobby, Game, Modals

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

| Variant | Background | Border | Text | Use Case |
|---------|-----------|--------|------|----------|
| primary | `#D4AF37` | none | `#1A1210` | Main actions (Play, Join, Create) |
| secondary | transparent | `1px #D4AF37` | `#D4AF37` | Secondary actions (Cancel, Back) |
| ghost | transparent | none | `#D4AF37` | Tertiary actions |
| danger | `#C41E3A` | none | `#F5E6D3` | Destructive (Resign) |

**States**:
- Default: as specified
- Hover: `brightness(1.1) translateY(-1px)` + shadow
- Active: `brightness(0.95) translateY(0)`
- Disabled: `opacity(0.5) cursor-not-allowed`
- Loading: spinner replaces text

---

### Input

**Purpose**: Text entry
**Used on**: Room name, player name

```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
}
```

**Styling**:
- Background: `rgba(0,0,0,0.3)`
- Border: `1px solid #5C3D1E`
- Border-radius: `8px`
- Focus: border `#D4AF37` + `box-shadow: 0 0 0 2px rgba(212,175,55,0.2)`

---

### CodeInput

**Purpose**: 6-character room code entry
**Used on**: Join Room

```typescript
interface CodeInputProps {
  value: string;  // 6-char string
  onChange: (code: string) => void;
  error?: string;
  disabled?: boolean;
}
```

**Styling**:
- 6 separate boxes, 48px × 56px each
- Monospace font, uppercase
- Auto-advance to next box on input
- Paste support (detect 6-char string)
- States: default, filled, error (red border + shake)

---

### Card

**Purpose**: Container for related content
**Used on**: Room cards, settings panels

```typescript
interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
}
```

**Styling**:
- Background: `#2C1810`
- Border: `1px solid rgba(212,175,55,0.2)`
- Border-radius: `8px`
- Padding: `24px`
- Hover (if hoverable): `border-color: #D4AF37` + shadow

---

### Badge

**Purpose**: Status indicators
**Used on**: Room status, game status

```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

| Variant | Background | Text | Use |
|---------|-----------|------|-----|
| success | `rgba(76,175,80,0.2)` | `#4CAF50` | Room waiting |
| warning | `rgba(255,193,7,0.2)` | `#FFC107` | Game in progress |
| error | `rgba(244,67,54,0.2)` | `#F44336` | Connection error |
| info | `rgba(33,150,243,0.2)` | `#2196F3` | Information |
| neutral | `rgba(168,144,128,0.2)` | `#A89080` | Neutral states |

---

### Modal

**Purpose**: Overlay for dialogs
**Used on**: Rules, Side Selection, Confirmations

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

**Styling**:
- Backdrop: `rgba(0,0,0,0.7)` with `backdrop-filter: blur(4px)`
- Content: `#2C1810` with `1px solid rgba(212,175,55,0.3)`
- Border-radius: `12px`
- Max-width: sm=320px, md=480px, lg=640px
- Entrance: scale 0.95→1 + fade, 200ms

---

### Avatar

**Purpose**: Player identification
**Used on**: Player panels

```typescript
interface AvatarProps {
  name: string;
  side?: 'red' | 'black';
  size?: 'sm' | 'md' | 'lg';
  connected?: boolean;
  isCurrentTurn?: boolean;
}
```

**Styling**:
- Circle with first letter of name
- Background: side color (red `#C41E3A` or black `#1A1A1A`)
- Text: white, bold
- Connected indicator: green dot (bottom-right)
- Current turn: gold ring (2px `#D4AF37`)

---

### Toast

**Purpose**: Temporary notifications
**Used on**: Error messages, success confirmations

```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;  // ms, default 3000
}
```

**Styling**:
- Position: bottom-center, 80px from bottom
- Background: type-colored
- Text: white
- Slide-up entrance, fade-out exit
- Auto-dismiss after duration

---

## Game Components

### GameBoard

**Purpose**: 9x10 board with pieces
**Used on**: Game screen

```typescript
interface GameBoardProps {
  board: (string | null)[][];  // 10 rows x 9 cols
  selectedCell: Position | null;
  validMoves: Position[];
  currentTurn: 'red' | 'black';
  playerSide: 'red' | 'black';  // for orientation
  onCellClick: (row: number, col: number) => void;
  lastMove?: { from: Position; to: Position };
  checkPosition?: Position;  // king in check
  isGameOver?: boolean;
}
```

**Layout**:
- CSS Grid: 9 columns, 10 rows
- Cell size: 48px desktop, ~36px mobile
- Board background: `#8B5A2B`
- Grid lines: `#5C3D1E`, 1px

**Special markers**:
- River: row 4-5, horizontal band with subtle blue tint
- Palace: diagonal lines in corners for CT/S restricted areas

**Coordinates**:
- Top: a b c d e f g h i (columns)
- Left: 10 9 8 7 6 5 4 3 2 1 (rows)

---

### Piece

**Purpose**: Individual game piece
**Used on**: GameBoard

```typescript
interface PieceProps {
  type: 'CT' | 'S' | 'X' | 'M' | 'P' | 'T';
  side: 'red' | 'black';
  isSelected?: boolean;
  isValidTarget?: boolean;
  isCaptureTarget?: boolean;
  isLastMoveFrom?: boolean;
  isLastMoveTo?: boolean;
  isInCheck?: boolean;
  onClick?: () => void;
}
```

**Styling**:
- Shape: Circle, 40px diameter desktop / 32px mobile
- Red pieces: gradient `#C41E3A` → `#8B1528`, gold border 2px
- Black pieces: gradient `#1A1A1A` → `#3A3A3A`, silver border 2px
- Label: centered, Vietnamese abbreviation, 16px bold

**States**:
| State | Visual |
|-------|--------|
| Default | Standard appearance |
| Selected | Gold ring (`box-shadow: 0 0 0 3px #D4AF37`) |
| Valid Target | Green dot overlay (12px circle, centered) |
| Capture Target | Red ring overlay |
| Last Move (from/to) | Subtle yellow highlight `rgba(212,175,55,0.3)` |
| In Check | Red pulsing glow animation |
| Captured | Grayscale, 24px, shown in player panel |

---

### PlayerPanel

**Purpose**: Player information and status
**Used on**: Game screen (above and below board)

```typescript
interface PlayerPanelProps {
  player: {
    id: string;
    name: string;
    side: 'red' | 'black';
  } | null;
  isCurrentTurn: boolean;
  connected: boolean;
  capturedPieces?: string[];
  lastMove?: { from: string; to: string };
  orientation?: 'top' | 'bottom';  // where displayed on board
}
```

**Layout**:
```
┌─────────────────────────────────────────────┐
│ [Avatar] Name          [Captured: P T x]   │
│ ● Your turn                               │
└─────────────────────────────────────────────┘
```

**States**:
| State | Visual |
|-------|--------|
| Waiting (empty) | "Waiting for opponent..." |
| Waiting (opponent turn) | "Waiting..." |
| Your Turn | "Your turn" + gold dot indicator |
| Disconnected | Grayed out, "Reconnecting..." |
| Winner | Gold border, "Winner!" label |

---

### MoveHistory

**Purpose**: Scrollable list of moves
**Used on**: Game screen (side panel or bottom)

```typescript
interface MoveHistoryProps {
  moves: MoveRecord[];
  currentMoveIndex?: number;  // for replay mode
  onMoveClick?: (index: number) => void;
}
```

**Layout**:
- Scrollable container, max-height 200px
- Each move: number, side color dot, "from → to"
- Latest move at bottom
- Click move → highlight that position on board

**Format**: `1. 🔴 CT d1 → d2`

---

### RoomCard

**Purpose**: Public room listing item
**Used on**: Lobby (public rooms list)

```typescript
interface RoomCardProps {
  room: {
    roomCode: string;
    name: string;
    status: 'waiting' | 'playing' | 'full';
    players: { red: PlayerInfo | null; black: PlayerInfo | null };
    createdAt: string;
  };
  onJoin: (roomCode: string) => void;
}
```

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Room Name                      [🟢 Waiting]  │
│ Code: ABC123 · Players: 1/2                 │
│                        [Join]               │
└─────────────────────────────────────────────┘
```

**States**:
| Status | Badge | Button |
|--------|-------|--------|
| waiting | Green "Waiting" | "Join" enabled |
| playing | Yellow "In Game" | "Join" disabled |
| full | Gray "Full" | "Join" disabled |

---

### ValidMoves

**Purpose**: Overlay showing valid move destinations
**Used on**: GameBoard (rendered on top of pieces)

```typescript
interface ValidMovesProps {
  moves: Position[];
  cellSize: number;
}
```

**Styling**:
- Small circle (12px) centered in valid squares
- Green `rgba(76,175,80,0.8)` for normal moves
- Red ring for capture moves
- Pulse animation if only one valid move

---

### CapturedPieces

**Purpose**: Display captured enemy pieces
**Used on**: PlayerPanel (right side)

```typescript
interface CapturedPiecesProps {
  pieces: string[];  // e.g., ['p', 't', 't']
  side: 'red' | 'black';  // color of captured pieces
}
```

**Layout**:
- Horizontal row of small piece icons (24px)
- Grouped by piece type
- Grayscale version of piece

---

### GameOverModal

**Purpose**: Display game result
**Used on**: Game screen (overlay)

```typescript
interface GameOverModalProps {
  isOpen: boolean;
  winner: 'red' | 'black' | 'draw';
  endCondition: 'checkmate' | 'sâm-sacrifice' | 'resignation' | 'draw';
  moveCount: number;
  onRematch: () => void;
  onShare: () => void;
  onBackToLobby: () => void;
}
```

**Layout**: See game-over.md screen

---

### HowToPlayModal

**Purpose**: Rules explanation
**Used on**: Lobby (help button)

```typescript
interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Content**:
1. Board setup (diagram)
2. Piece movements (one section per piece type with diagram)
3. Special rules (river, palace, Sâm)
4. Win conditions
5. Controls (click to select, click to move)

---

### SideSelectionModal

**Purpose**: Choose side when playing vs AI
**Used on**: Lobby (Play vs AI button)

```typescript
interface SideSelectionModalProps {
  isOpen: boolean;
  onSelect: (side: 'red' | 'black' | 'random') => void;
  onClose: () => void;
}
```

**Layout**:
```
┌─────────────────────────────┐
│      Choose Your Side      │
│                             │
│   [🔴 Red]  [⚫ Black]      │
│         [🎲 Random]        │
│                             │
└─────────────────────────────┘
```

---

## Component States Summary

| Component | States |
|-----------|--------|
| Button | default, hover, active, disabled, loading |
| Input | default, focused, error, disabled |
| CodeInput | empty, partially-filled, complete, error |
| Card | default, hoverable, clickable |
| Badge | success, warning, error, info, neutral |
| Modal | closed, open, closing |
| Avatar | disconnected, connected, current-turn |
| Toast | success, error, info |
| Piece | default, selected, valid-target, capture-target, last-move, in-check, captured |
| PlayerPanel | waiting-empty, waiting-opponent, your-turn, opponent-turn, disconnected, winner |
| RoomCard | waiting, playing, full |
| GameBoard | default, piece-selected, opponent-turn, check, game-over |
| GameOverModal | red-win, black-win, draw |