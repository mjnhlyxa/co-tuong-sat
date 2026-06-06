# Game Over Screen

**Route**: `/game/[roomCode]` (overlay modal on game)
**Purpose**: Display game result and actions

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                    ┌───────────────────┐                    │
│                    │                   │                    │
│                    │   RED WINS!       │                    │
│                    │                   │                    │
│                    │   Checkmate       │                    │
│                    │   24 moves        │                    │
│                    │                   │                    │
│                    │  ┌────┐ ┌────┐    │                    │
│                    │  │ 🎉 │ │ 🎊 │    │  (confetti)        │
│                    │  └────┘ └────┘    │                    │
│                    │                   │                    │
│                    │  [Rematch]        │                    │
│                    │  [Share Result]   │                    │
│                    │  [Back to Lobby]  │                    │
│                    │                   │                    │
│                    └───────────────────┘                    │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Variants

### Red Wins (Checkmate)
```
┌─────────────────────────────┐
│                             │
│      🏆 RED WINS! 🏆        │
│                             │
│      Checkmate              │
│      24 moves               │
│                             │
│      [Rematch]              │
│      [Share Result]         │
│      [Back to Lobby]        │
│                             │
└─────────────────────────────┘
```

### Red Wins (Sâm Sacrifice)
```
┌─────────────────────────────┐
│                             │
│   ⚔️ SÂM SACRIFICE! ⚔️      │
│                             │
│      RED WINS!              │
│      You sacrificed your    │
│      Commander to capture    │
│      the enemy King!        │
│                             │
│      [Rematch]              │
│      [Share Result]         │
│      [Back to Lobby]        │
│                             │
└─────────────────────────────┘
```

### Black Wins (Resignation)
```
┌─────────────────────────────┐
│                             │
│      BLACK WINS!            │
│                             │
│      Minh resigned          │
│                             │
│      [Rematch]              │
│      [Share Result]         │
│      [Back to Lobby]        │
│                             │
└─────────────────────────────┘
```

### Draw
```
┌─────────────────────────────┐
│                             │
│          DRAW               │
│                             │
│      3-fold repetition      │
│      42 moves               │
│                             │
│      [Play Again]           │
│      [Share Result]         │
│      [Back to Lobby]        │
│                             │
└─────────────────────────────┘
```

## Elements

| Element | Description | Behavior |
|---------|-------------|----------|
| Winner Announcement | Large text with winner color | Non-interactive, celebratory |
| End Condition | Explanation of how game ended | Descriptive text |
| Move Count | Total moves in game | Display only |
| Confetti | Animated particles in winner color | Auto-play on load |
| Rematch Button | Primary button | Start new game with same opponent |
| Share Result Button | Secondary button | Copy game link to clipboard |
| Back to Lobby Button | Ghost button | Return to home page |

## States

### Victory (Red)
- Red theme with gold accents
- Confetti animation (red + gold particles)
- Trophy icon

### Victory (Black)
- Dark/silver theme
- Confetti animation (dark + silver particles)
- Crown icon

### Sâm Sacrifice
- Golden theme throughout
- Special "SÂM SACRIFICE" title
- Sword/commander icon
- Golden confetti

### Draw
- Neutral theme
- No confetti
- Handshake icon

## Key Interactions

### Rematch
1. Click "Rematch"
2. Button shows loading spinner
3. New game created in same room
4. Redirect to game start

### Share Result
1. Click "Share Result"
2. Game link copied to clipboard
3. Toast "Link copied!"
4. Link opens replay (future feature)

### Back to Lobby
1. Click "Back to Lobby"
2. Confirm if needed
3. Redirect to home page

---

## Component Inventory

### GameOverModal
- Overlay with blur backdrop
- Centered content
- Winner-specific theming
- Animated entrance (scale up + fade)

### ConfettiEffect
- Canvas-based particle system
- 50-100 particles
- Fall from top
- Winner colors
- Duration: 3 seconds

### ResultButton
- Primary (Rematch): gold background
- Secondary (Share): transparent with gold border
- Ghost (Back to Lobby): text only