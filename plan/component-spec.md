# co-tuong-sat — Component Specifications

> **C4 Level**: 3 — UI Component Specifications

## 1. UI Components Overview

### 1.1 Component Hierarchy

```
src/
├── ui/                          # Generic UI primitives
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── Tooltip.tsx
│   └── Spinner.tsx
│
└── game/                        # Game-specific UI
    ├── GameBoard.tsx             # 9x10 board with pieces
    ├── Piece.tsx                 # Individual piece with SVG
    ├── PlayerPanel.tsx           # Player info, turn indicator
    ├── MoveHistory.tsx           # Move list (scrollable)
    ├── RoomCard.tsx              # Lobby room listing
    ├── RoomCodeInput.tsx         # 6-char code input
    ├── PromotionModal.tsx        # Sâm promotion dialog (future)
    ├── GameOverModal.tsx         # Result display
    ├── CapturedPieces.tsx        # Captured pieces display
    ├── ValidMoves.tsx            # Valid move indicators (overlay)
    └── HowToPlayModal.tsx        # Rules explanation
```

---

## 2. Generic UI Components

### 2.1 Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// Variants:
// primary: Gold background (#D4AF37), dark text — main actions
// secondary: Transparent with gold border — secondary actions
// ghost: No border, gold text — tertiary actions
// danger: Red background (#C41E3A) — destructive actions

// Sizes:
// sm: h-8 px-3 text-sm
// md: h-10 px-4 text-base
// lg: h-12 px-6 text-lg
```

### 2.2 Modal

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

// Backdrop: rgba(0, 0, 0, 0.7)
// Animation: fade in 200ms, scale from 0.95 to 1
// Close on: backdrop click, X button, Escape key
```

### 2.3 Card

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;  // Adds shadow on hover
  onClick?: () => void;
}

// Default: bg-[#2C1810] border border-[#8B4513]
// Hover: shadow-lg shadow-black/20
```

### 2.4 Input

```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  type?: 'text' | 'number';
  className?: string;
}

// Border: border-[#8B4513]
// Focus: ring-2 ring-[#D4AF37]
// Error: border-[#C41E3A], error message below
```

### 2.5 Badge

```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

// success: bg-green-900/30 text-green-400
// warning: bg-yellow-900/30 text-yellow-400
// error: bg-red-900/30 text-red-400
// info: bg-blue-900/30 text-blue-400
// neutral: bg-gray-800 text-gray-300
```

### 2.6 Avatar

```typescript
interface AvatarProps {
  name: string;
  side?: 'red' | 'black';  // Color based on side
  size?: 'sm' | 'md' | 'lg';
  connected?: boolean;
  isCurrentTurn?: boolean;
}

// Shows first letter of name
// Red side: text-[#C41E3A]
// Black side: text-[#1A1A1A] bg-gray-200
// Connected indicator: green dot
// Current turn: gold ring
```

---

## 3. Game Components

### 3.1 GameBoard

```typescript
interface GameBoardProps {
  board: Cell[][];           // 10x9 grid
  selectedCell: Position | null;
  validMoves: Position[];
  currentTurn: Side;
  playerSide: Side;           // For board orientation
  onCellClick: (row: number, col: number) => void;
  onPieceSelected?: (row: number, col: number) => void;
  highlightedCells?: Position[];  // Last move
  capturedPieces?: {
    red: string[];
    black: string[];
  };
}

// Layout:
// - 9 columns (a-i), 10 rows (1-10)
// - River line between row 4 and 5 (horizontal line)
// - Palace corners indicated with diagonal lines
// - Coordinate labels on edges

// States:
// default: board with pieces in position
// piece-selected: show valid moves as green dots
// opponent-turn: dim own pieces slightly
// check: highlighted king with red glow
// game-over: board frozen, overlay with result

// Interactions:
// - Click empty cell when piece selected: move if valid
// - Click own piece: select (if current turn)
// - Click opponent piece when selected: capture if valid
```

### 3.2 Piece

```typescript
interface PieceProps {
  type: 'CT' | 'S' | 'X' | 'M' | 'P' | 'T';
  side: 'red' | 'black';
  position: { row: number; col: number };
  isSelected?: boolean;
  isValidTarget?: boolean;
  isLastMove?: boolean;
  isInCheck?: boolean;
  onClick?: () => void;
}

// Visual:
// - Circular piece with gradient
// - Red: #C41E3A with gold border
// - Black: #1A1A1A with silver border
// - Vietnamese label centered (T, S, M, X, P, CT)
// - Size: 40px diameter desktop, 32px mobile

// States:
// - default: normal appearance
// - selected: gold ring glow
// - valid-target: green dot overlay
// - last-move: subtle highlight
// - in-check: pulsing red glow
// - captured: grayscale, smaller size in captured area
```

### 3.3 PlayerPanel

```typescript
interface PlayerPanelProps {
  player: {
    id: string;
    name: string;
    side: 'red' | 'black';
  } | null;  // null if no player yet
  isCurrentTurn: boolean;
  connected: boolean;
  capturedPieces?: string[];
  lastMove?: { from: string; to: string };
  showResignButton?: boolean;
  onResign?: () => void;
}

// Layout:
// - Player name + avatar (left)
// - Turn indicator (center) — "Your turn" or "Waiting..."
// - Captured pieces display (right)

// States:
// - waiting: "Waiting for opponent..."
// - active: shows last move, captured pieces
// - disconnected: grayed out, "Reconnecting..."
// - winner: gold border, celebration
```

### 3.4 MoveHistory

```typescript
interface MoveHistoryProps {
  moves: MoveRecord[];
  currentMoveIndex?: number;  // For replay mode
  onMoveClick?: (index: number) => void;
  orientation?: 'vertical' | 'horizontal';
}

// Layout:
// - Scrollable list, newest at bottom
// - Format: "1. red: i10 → i9"
// - Click to jump to that position (replay mode)

// States:
// - empty: "No moves yet"
// - scrolling: custom scrollbar styled
// - clickable: hover highlight
```

### 3.5 RoomCard

```typescript
interface RoomCardProps {
  room: {
    roomCode: string;
    name: string;
    status: 'waiting' | 'playing';
    players: { red: PlayerInfo | null; black: PlayerInfo | null };
    createdAt: string;
  };
  onJoin: (roomCode: string) => void;
}

// Layout:
// - Room name + code (for sharing)
// - Player count: "1/2 players"
// - Status badge
// - Join button

// States:
// - waiting: green badge, join enabled
// - playing: yellow badge, join disabled ("In game")
// - full: disabled
```

### 3.6 RoomCodeInput

```typescript
interface RoomCodeInputProps {
  value: string;
  onChange: (code: string) => void;
  onSubmit: () => void;
  error?: string;
  disabled?: boolean;
}

// Layout:
// - 6 input boxes, auto-advance on digit
// - Uppercase only, alphanumeric
// - Paste support (detect 6-char string)

// States:
// - default: border-[#8B4513]
// - error: border-[#C41E3A], shake animation
// - loading: spinner
// - disabled: grayed out
```

### 3.7 ValidMoves (Overlay)

```typescript
interface ValidMovesProps {
  moves: Position[];
  boardSize: number;
  cellSize: number;
}

// Renders dots on valid move squares
// Green dot: normal move
// Red dot with ring: capture move
// Pulsing animation for single valid move
```

### 3.8 GameOverModal

```typescript
interface GameOverModalProps {
  isOpen: boolean;
  winner: 'red' | 'black' | 'draw';
  endCondition: 'checkmate' | 'sâm-sacrifice' | 'resignation' | 'draw';
  moveCount: number;
  onClose: () => void;
  onRematch: () => void;
  onShare: () => void;
  shareUrl?: string;
}

// Layout:
// - Large winner announcement
// - End condition description
// - Action buttons: Rematch, Share, Close

// Variants:
// - Red wins: red theme, gold accents
// - Black wins: dark theme, silver accents
// - Draw: neutral theme
```

### 3.9 HowToPlayModal

```typescript
interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Content:
// 1. Board setup (image)
// 2. Piece movements (diagram for each piece type)
// 3. Special rules (river, Sâm sacrifice)
// 4. Win conditions
// 5. Sample moves (interactive?)
```

---

## 4. Layouts

### 4.1 Lobby Page Layout

```
┌──────────────────────────────────────────────────┐
│  co-tuong-sat                   [How to Play] ?  │
├──────────────────────────────────────────────────┤
│                                                  │
│   ┌─────────────────┐  ┌─────────────────────┐  │
│   │  PLAY VS AI      │  │   CREATE ROOM       │  │
│   │  [Start]         │  │   Room name: [...]   │  │
│   └─────────────────┘  │   [Create]           │  │
│                        └─────────────────────┘  │
│                                                  │
│   ┌───────────────────────────────────────────┐  │
│   │  JOIN ROOM                                │  │
│   │  [ ] [ ] [ ] [ ] [ ] [ ]                  │  │
│   │  [Join]                                   │  │
│   └───────────────────────────────────────────┘  │
│                                                  │
│   ─────────── PUBLIC ROOMS ───────────          │
│   ┌───────────────────────────────────────────┐  │
│   │ Room 1 | ABC123 | 1/2 | [Join]            │  │
│   │ Room 2 | DEF456 | 2/2 | In Game           │  │
│   └───────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.2 Game Page Layout

```
┌──────────────────────────────────────────────────┐
│  ← Back   Room: ABC123              [Menu] [?]   │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─ Black Player ─────────────────────────────┐  │
│  │ Name        Your turn      [Captured: ...] │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │   9x10 Board with pieces                   │  │
│  │   (River line, palace markers)              │  │
│  │   (Valid moves overlay)                    │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌─ Red Player ───────────────────────────────┐  │
│  │ Name        Waiting...     [Captured: ...] │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌─ Move History ─────────────────────────────┐  │
│  │ 1. red: i10 → i9                          │  │
│  │ 2. black: a1 → a2                         │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  [Resign]                          [Offer Draw] │
└──────────────────────────────────────────────────┘
```

### 4.3 Mobile Responsive

- Board scales to full width
- Player panels stack horizontally above/below board
- Move history collapses to expandable drawer
- All interactive elements minimum 44x44px touch target

---

## 5. Animations

### 5.1 Piece Movement

```css
/* Move animation */
.piece-moving {
  transition: transform 300ms ease-out;
}

/* On capture */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.captured-piece {
  animation: shake 200ms ease-in-out;
  opacity: 0;
  transition: opacity 200ms;
}
```

### 5.2 Sâm Sacrifice

```css
@keyframes golden-glow {
  0%, 100% { box-shadow: 0 0 10px #D4AF37; }
  50% { box-shadow: 0 0 30px #D4AF37, 0 0 60px #FFD700; }
}

.sam-sacrifice-move {
  animation: golden-glow 500ms ease-in-out 3;
}
```

### 5.3 Win Celebration

```css
@keyframes confetti {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
```

---

## 6. Accessibility

- All interactive elements keyboard-focusable
- Tab order: Board → Controls → Move history
- Arrow keys: navigate board cells
- Enter: select/move
- Escape: deselect/cancel
- aria-labels on all pieces: "Red Horse at position a3"
- Live region for move announcements
- High contrast mode support