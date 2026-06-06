# co-tuong-sat — Brainstorm

> Status: Draft | Created: 2026-05-29

## Overview
Co Tuong Sam là biến thể cờ tướng Việt Nam với luật Sâm đặc biệt — người chơi có thể hy sinh Tướng (Sâm) để bắt Tướng đối thủ, tạo nên chiến thuật đột phá và kịch tính. Game hỗ trợ chơi multiplayer real-time 1v1, vs AI, và lưu lại lịch sử trận đấu. Nhắm đến người chơi yêu thích cờ tướng truyền thống muốn trải nghiệm luật chơi Việt Nam nguyên bản trên nền tảng web.

## Game Concept
- **Genre**: Strategy board game / turn-based multiplayer
- **Platform**: Web browser — desktop primary, mobile responsive
- **Session length**: Medium 15-30 min per game
- **Multiplayer**: Real-time 1v1 via WebSocket, async mode, single-player vs AI
- **Account required**: No — anonymous play by default, optional login for stats

## Target Audience
- Người chơi cờ tướng Việt Nam muốn chơi online với luật Sâm nguyên bản
- Vietnamese diaspora chơi cờ truyền thống từ xa
- Fan strategy games muốn thử biến thể cờ tướng
- Người chơi muốn train kỹ năng với AI opponent

## Core Gameplay Loop

### Turn-based Flow
1. Player sees board state — highlighted valid moves
2. Player clicks piece → sees all legal destination squares
3. Player clicks destination → move animates, server validates
4. Opponent's turn begins
5. Repeat until checkmate or Sâm sacrifice wins

### Sâm Special Mechanic
- Khi Sâm (Commander) bị chiếu và không có nước thoát, player có thể hy sinh Sâm để bắt Tướng đối thủ
- Đây là nước đi cuối cùng chỉ dùng được khi Tướng đã bị chiếu và không còn nước thoát hợp lệ
- Tạo ra moment "all-or-nothing" kịch tính

### Checkmate Detection
- Continuous check on all pieces after every move
- Win: opponent's General/Sâm captured, or opponent has no legal moves while in check

## Features

### Must-Have (MVP)
1. **Board rendering**: 9x10 grid, pieces as SVG/PNG, river line at row 5
2. **Move validation engine**: Full rule validation for all 16 piece types
3. **Real-time multiplayer**: WebSocket room-based 1v1
4. **Room system**: Create room, join room via code, public lobby
5. **Turn management**: Alternating turns, move timeout (optional)
6. **Sâm sacrifice rule**: Special win condition when General is in checkmate
7. **Game state persistence**: Mid-game save to MongoDB
8. **Move history**: Record all moves for review
9. **AI opponent**: Medium difficulty random-valid-moves AI
10. **Board flip**: Option to play as Black side (board rotated)

### Nice-to-Have (Post-MVP)
1. **AI difficulty levels**: Easy, Medium, Hard (minimax with alpha-beta pruning)
2. **Tournament mode**: Round-robin, elimination brackets
3. **Spectator mode**: Watch ongoing games
4. **Chat in-game**: Quick emotes or text
5. **Leaderboard**: ELO rating system
6. **Profile/stats**: Win/loss, favorite openings
7. **Sound effects**: Piece movement, capture, win/lose
8. **Mobile push notifications**: Turn reminder
9. **Replay system**: Watch past games

### Out of Scope
- In-game voice chat — too complex for v1
- Payment/monetization — v1 is free to play
- Cross-platform sync (mobile + web simultaneously) — defer
- Tournament prize money — legal complexity

## User Experience Goals

### Time to First Game
Target < 30 seconds from landing page to first move. No signup required. Board displays immediately on page load with "Play vs AI" as default option.

### Onboarding
- Landing page shows board with animated first-move demo (5 seconds)
- "How to Play" button opens modal with Sâm rules explained in 3 bullet points + diagram
- In-game: clicking piece shows tooltip with legal moves count
- Hover on piece shows movement pattern indicator

### Mobile
- Board scales to fit screen width with maintained aspect ratio
- Touch: tap piece → tap destination
- No pinch-zoom needed; board is single-view
- Responsive layout: side panel collapses to bottom sheet on mobile

### Accessibility
- Keyboard navigation: arrow keys to move selection, Enter to confirm
- Color contrast ratio 4.5:1 minimum
- Screen reader announces moves: "Red Horse from C1 to C3"
- Piece symbols have text alternatives

## Social & Virality Features

### Room System
- **Create Room**: Generates 6-char alphanumeric code (e.g., "ABC123")
- **Join Room**: Enter code to join existing room
- **Public Lobby**: List of waiting rooms with player names, avg rating
- **Share Link**: Copy room URL to send to friend

### Game Sharing
- After game ends, "Share Result" button copies link to game replay
- Replay viewable without login

### Social Discovery
- "Find Opponent" button matches with random available player
- Friend codes: optional username system

## Data to Persist

### Game State Document
```json
{
  "_id": "ObjectId",
  "roomCode": "ABC123",
  "status": "waiting | playing | finished",
  "board": "9x10 array of piece codes",
  "currentTurn": "red | black",
  "moveHistory": [{ "from": "C1", "to": "C3", "piece": "H", "timestamp": "..." }],
  "players": {
    "red": { "id": "anon-xxx", "name": "Player1" },
    "black": { "id": "anon-yyy", "name": "Player2" }
  },
  "winner": "red | black | draw",
  "endCondition": "checkmate | sâm-sacrifice | timeout | resign",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### Player Document
```json
{
  "_id": "ObjectId",
  "anonId": "localStorage-uuid",
  "displayName": "Player123",
  "elo": 1200,
  "gamesPlayed": 45,
  "gamesWon": 23,
  "createdAt": "ISODate"
}
```

### Move History Collection
```json
{
  "_id": "ObjectId",
  "gameId": "ObjectId",
  "moveNumber": 1,
  "from": "I10",
  "to": "I9",
  "piece": "k",
  "captured": null,
  "isSacrifice": false,
  "timestamp": "ISODate"
}
```

## Technical Feasibility Assessment

### Straightforward
- **Board rendering**: CSS grid or canvas, piece images from CDN
- **Turn management**: State machine in React, server is source of truth
- **Room creation/join**: Simple MongoDB document + WebSocket room code
- **Move validation (basic pieces)**: Advisors, Ministers, Soldiers follow simple rules
- **Static AI**: Random legal move selection for medium difficulty
- **Board flip**: CSS transform rotate 180°

### Complex or Risky
- **Real-time WebSocket sync**: Race conditions if both players click simultaneously — need server-side move validation queue
- **Sâm sacrifice detection**: Must detect when General has no legal moves AND Sâm is on board, then validate sacrifice move
- **Checkmate/stalemate detection**: Full board analysis after each move — O(n²) but board is small so acceptable
- **AI minimax with alpha-beta**: Deep evaluation requires piece-square tables, move ordering for performance
- **Reconnection handling**: Player disconnects mid-game — need timeout + reconnect window

### Open Questions
- Sâm piece name in English: "Commander" vs "General" — need clear UI to avoid confusion with regular General
- River crossing rule for Soldiers: exactly as Xiangqi (one step forward until crossed, then diagonal allowed) or simplified?
- Time control: 15 min per side with increment, or unlimited?
- Draw detection: 3-fold repetition, 50-move rule, or always allow draw offer?

## Competitive Landscape

### Existing Games
- **Co Tuong Online** (Vietnam): Popular but dated UI, mostly Flash
- **Xiangqi.com**: Chinese chess, not Vietnamese Sâm variant
- **Lichess.org**: Only Western chess
- **Chess.com**: Western only

### Differentiation
- Native Vietnamese Sâm rules (not Xiangqi clone)
- Modern web stack: Next.js + FastAPI, no Flash
- Real-time multiplayer with room codes
- AI opponent built-in (most competitors require registration for AI)
- Mobile-first responsive design
- Clean, minimalist visual design inspired by Vietnamese lacquerware aesthetic

## Visual Design Direction

### Aesthetic
Vietnamese lacquerware / áo giao lĩnh inspired — dark wood textures, gold accents, red/black piece contrast. Not cartoonish; dignified and traditional.

### Color Palette
- Board: `#8B4513` (saddle brown wood)
- Red pieces: `#C41E3A` (crimson)
- Black pieces: `#1A1A1A` (near black)
- Background: `#2C1810` (dark wood)
- Accent/gold: `#D4AF37`
- River: `#4A90D9` (subtle blue tint)
- Valid move indicator: `#90EE90` (light green glow)

### Typography
- Font: "Playfair Display" for headings, "Inter" for UI
- Piece labels: Vietnamese abbreviations (T, S, M, X, P, CT for Sâm)

### Animations
- Piece movement: 300ms ease-out slide
- Capture: piece fades + slight shake on captured piece square
- Sâm sacrifice: special golden particle effect
- Win: confetti in winner's color