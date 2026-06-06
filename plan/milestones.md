# co-tuong-sat — Implementation Milestones

> **C4 Level**: 3 — Component Specification (Implementation Phases)

## Overview

The development is organized into 4 phases:
- **Phase 1: Core MVP** — Complete playable game
- **Phase 2: Multiplayer** — Real-time WebSocket multiplayer
- **Phase 3: AI Opponent** — Computer opponent
- **Phase 4: Polish** — UX improvements and polish

---

## Phase 1: Core MVP

**Timeline**: Week 1-2
**Goal**: Playable local game (two players, same device)

### Milestones

#### M1.1: Project Setup
- [ ] Initialize Bun monorepo with `apps/web` (Next.js) and `apps/api` (FastAPI)
- [ ] Configure TypeScript for both apps
- [ ] Set up Tailwind CSS in Next.js
- [ ] Configure MongoDB connection
- [ ] Create GitHub repo and initial push

#### M1.2: Game Engine (Core Logic)
- [ ] Define TypeScript types for pieces, board, moves
- [ ] Implement board initialization (10x9 grid with starting positions)
- [ ] Implement move validation for all piece types:
  - [ ] Sâm (Commander): 1 square any direction, palace only
  - [ ] Sĩ (Advisor): diagonal 1 square, palace only
  - [ ] Xe (Minister): horizontal/vertical any distance
  - [ ] Mã (Horse): L-shape (2+1), can be blocked
  - [ ] Pháo (Cannon): horizontal/vertical, jump to capture
  - [ ] Tốt (Soldier): forward only, diagonal after river
- [ ] Implement river crossing logic for Soldiers
- [ ] Implement palace boundary validation
- [ ] Implement check detection (is king in check?)
- [ ] Implement checkmate detection (no legal moves while in check)
- [ ] Implement Sâm sacrifice rule (winning move in checkmate)

#### M1.3: Frontend - Board Rendering
- [ ] Create GameBoard component (9x10 grid)
- [ ] Create Piece component with SVG rendering
- [ ] Implement board coordinate labels (a-i, 1-10)
- [ ] Draw river line between row 4-5
- [ ] Draw palace corner markers
- [ ] Implement board flip (rotate 180° for black perspective)

#### M1.4: Frontend - Interactivity
- [ ] Click to select piece
- [ ] Display valid moves as green dots
- [ ] Click destination to move
- [ ] Animate piece movement (300ms)
- [ ] Implement capture animation
- [ ] Turn indicator (red/black)
- [ ] Check warning (king highlighted)
- [ ] Game over detection and display

#### M1.5: State Management
- [ ] React Context for game state
- [ ] Game state reducer (select piece, move, undo)
- [ ] Move history tracking
- [ ] Board notation conversion (internal ↔ display)

### Deliverables
- [ ] Two players can play a complete game on same device
- [ ] All piece movement rules enforced
- [ ] Win condition detected correctly
- [ ] Clean visual design

---

## Phase 2: Multiplayer (WebSocket)

**Timeline**: Week 2-3
**Goal**: Two players on different devices can play

#### M2.1: Backend - Room System
- [ ] Room model (roomCode, name, isPrivate, host)
- [ ] REST endpoints: create room, list rooms, join room
- [ ] Room code generation (6-char alphanumeric)
- [ ] MongoDB persistence for rooms

#### M2.2: Backend - Game System
- [ ] Game model (board, players, currentTurn, moves)
- [ ] REST endpoints: create game, get game state, submit move
- [ ] Move validation on server (source of truth)
- [ ] Turn enforcement (only current player can move)
- [ ] Win/checkmate detection on server

#### M2.3: Backend - WebSocket
- [ ] WebSocket endpoint (`/ws/{roomCode}/{playerId}`)
- [ ] Connection management (track connected players)
- [ ] Broadcast game state updates
- [ ] Handle disconnects/reconnects
- [ ] Heartbeat/ping-pong

#### M2.4: Frontend - Multiplayer
- [ ] WebSocket client service
- [ ] Connect to room on page load
- [ ] Send moves via WebSocket
- [ ] Receive and apply game state updates
- [ ] Handle opponent's moves
- [ ] Reconnection logic with exponential backoff
- [ ] Loading states and error handling

#### M2.5: Lobby UI
- [ ] Create room form
- [ ] Room code input for joining
- [ ] Public rooms list
- [ ] Room sharing (copy link)

### Deliverables
- [ ] Two players can create/join rooms
- [ ] Real-time move synchronization
- [ ] Game state persisted in MongoDB

---

## Phase 3: AI Opponent

**Timeline**: Week 3-4
**Goal**: Single player can play vs AI

#### M3.1: AI Service
- [ ] AI player class
- [ ] Move generation (legal moves for current board state)
- [ ] Basic AI: random legal move selection

#### M3.2: AI - Minimax
- [ ] Minimax algorithm with alpha-beta pruning
- [ ] Piece-square tables (positional evaluation)
- [ ] Move ordering for pruning efficiency
- [ ] Depth limiting (3-4 plies for performance)

#### M3.3: AI - Integration
- [ ] AI makes moves automatically after player
- [ ] AI difficulty levels (Easy, Medium, Hard)
- [ ] AI thinking indicator (optional delay for UX)

#### M3.4: Single Player Mode
- [ ] "Play vs AI" button in lobby
- [ ] Player chooses side (red/black)
- [ ] AI vs Human game flow

### Deliverables
- [ ] Player can play vs AI
- [ ] AI makes legal moves
- [ ] AI provides reasonable challenge

---

## Phase 4: Polish

**Timeline**: Week 4
**Goal**: Production-ready with good UX

#### P4.1: Visual Polish
- [ ] Board design (wood texture background)
- [ ] Piece SVG improvements
- [ ] River and palace visual enhancements
- [ ] Color palette refinement
- [ ] Typography improvements

#### P4.2: Animations
- [ ] Piece movement animation (slide)
- [ ] Capture animation (fade + shake)
- [ ] Sâm sacrifice golden effect
- [ ] Win celebration (confetti)
- [ ] Move sound effects (optional)

#### P4.3: UX Improvements
- [ ] How to Play modal (rules explanation)
- [ ] Move history with clickable moves
- [ ] Captured pieces display
- [ ] Last move highlight
- [ ] Check indicator (pulsing)

#### P4.4: Mobile Optimization
- [ ] Responsive layout for 375px+
- [ ] Touch gesture support
- [ ] Collapsible panels
- [ ] Bottom sheet modals

#### P4.5: Error Handling & Edge Cases
- [ ] Invalid move prevention
- [ ] Connection error recovery
- [ ] Game state recovery on refresh
- [ ] Draw offer/reject flow

#### P4.6: Documentation
- [ ] README with setup instructions
- [ ] API documentation
- [ ] Deployment guide

### Deliverables
- [ ] Production-ready game
- [ ] Responsive on mobile
- [ ] Good UX with animations

---

## Progress Tracking

| Phase | Milestone | Target Date | Status |
|-------|-----------|-------------|--------|
| 1 | M1.1 Project Setup | Day 1 | TBD |
| 1 | M1.2 Game Engine | Day 3 | TBD |
| 1 | M1.3 Board Rendering | Day 5 | TBD |
| 1 | M1.4 Interactivity | Day 7 | TBD |
| 1 | M1.5 State Management | Day 10 | TBD |
| 2 | M2.1 Room System | Day 12 | TBD |
| 2 | M2.2 Game System | Day 14 | TBD |
| 2 | M2.3 WebSocket | Day 16 | TBD |
| 2 | M2.4 Frontend Multiplayer | Day 18 | TBD |
| 2 | M2.5 Lobby UI | Day 20 | TBD |
| 3 | M3.1 AI Service | Day 22 | TBD |
| 3 | M3.2 Minimax AI | Day 25 | TBD |
| 3 | M3.3 AI Integration | Day 27 | TBD |
| 3 | M3.4 Single Player Mode | Day 28 | TBD |
| 4 | P4.1-6 Polish | Day 30 | TBD |

---

## Definition of Done

### MVP (Phase 1 Complete)
- [ ] Two players can play complete game on same device
- [ ] All piece rules correctly enforced
- [ ] Win condition correctly detected
- [ ] Clean, playable UI

### Multiplayer (Phase 2 Complete)
- [ ] Two players can create/join rooms
- [ ] Moves sync in real-time (< 500ms)
- [ ] Game persists in database
- [ ] Reconnection works

### AI (Phase 3 Complete)
- [ ] Player can beat AI on easy mode
- [ ] AI makes legal moves always
- [ ] AI difficulty provides challenge

### Polish (Phase 4 Complete)
- [ ] Responsive on mobile (375px+)
- [ ] Animations smooth (60fps)
- [ ] No critical bugs
- [ ] Ready for production deployment