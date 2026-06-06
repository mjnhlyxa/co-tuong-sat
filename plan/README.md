# co-tuong-sat — Technical Plan

> **Status**: Draft | Created: 2026-05-29 | Last Updated: 2026-05-29
> **C4 Level**: 1 — Context Overview

## 1. Game Overview

### 1.1 Game Concept
Co Tuong Sam (Cờ Tướng Sâm) là biến thể cờ tướng Việt Nam với luật chơi đặc biệt về Sâm (Commander). Người chơi có thể hy sinh Sâm để bắt Tướng đối thủ — tạo nên chiến thuật đột phá và kịch tính. Game hỗ trợ multiplayer real-time 1v1 qua WebSocket, chế độ vs AI, và lưu trữ lịch sử trận đấu trên MongoDB.

**Điểm khác biệt**: Không phải Xiangqi — đây là luật Sâm nguyên bản của Việt Nam, với Tướng được thay bằng Sâm có khả năng hy sinh để chiến thắng.

### 1.2 Game Type
- **Genre**: Strategy board game / turn-based multiplayer
- **Platform**: Web browser — desktop primary, mobile responsive
- **Session Length**: Medium 15-30 min per game
- **Multiplayer Model**: Real-time 1v1 via WebSocket, async mode available, single-player vs AI
- **Account Required**: No — anonymous play by default

### 1.3 Target Audience
- Người chơi cờ tướng Việt Nam muốn trải nghiệm luật Sâm nguyên bản online
- Vietnamese diaspora muốn chơi cờ truyền thống từ xa
- Fan strategy games muốn thử biến thể cờ tướng
- Người chơi muốn train kỹ năng với AI opponent

---

## 2. System Context (C4 L1)

### 2.1 User Interactions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS                                           │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────────────────┐   │
│   │ Desktop     │      │ Mobile      │      │ Future: Admin           │   │
│   │ Browser     │      │ Browser     │      │ Dashboard               │   │
│   └──────┬──────┘      └──────┬──────┘      └───────────┬─────────────┘   │
└──────────┼─────────────────────┼──────────────────────────┼───────────────────┘
           │                    │                          │
           ▼                    ▼                          ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         co-tuong-sat                                        │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ Frontend: Next.js 14 App (Browser)                                  │    │
│  │  - Static lobby page (SSG for SEO)                                  │    │
│  │  - Dynamic game page (client-side rendering)                       │    │
│  │  - Game engine (pure JS/TS, no React dependency for core logic)    │    │
│  │  - WebSocket client for real-time communication                    │    │
│  └────────────────────────────────┬───────────────────────────────────┘    │
│                                   │                                         │
│  ┌────────────────────────────────▼───────────────────────────────────┐    │
│  │ Backend: FastAPI (apps/api)                                         │    │
│  │  - REST API for game CRUD operations                               │    │
│  │  - WebSocket endpoints for real-time game state                   │    │
│  │  - Move validation (server-side source of truth)                   │    │
│  │  - AI opponent engine (minimax with alpha-beta)                   │    │
│  │  - Player identity management                                      │    │
│  └────────────────────────────────┬───────────────────────────────────┘    │
│                                   │                                         │
│  ┌────────────────────────────────▼───────────────────────────────────┐    │
│  │ Database: MongoDB 10.60.184.61:27017                               │    │
│  │  - games collection (game state, moves, results)                   │    │
│  │  - rooms collection (lobby, player assignments)                    │    │
│  │  - players collection (stats, ELO rating)                          │    │
│  └────────────────────────────────┬───────────────────────────────────┘    │
│                                   │                                         │
│  ┌────────────────────────────────▼───────────────────────────────────┐    │
│  │ CDN/Cache: Vercel Edge Network                                     │    │
│  │  - Static asset caching                                            │    │
│  │  - DDoS protection                                                │    │
│  └────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 External System Integrations

| External System | Purpose | Integration Method |
|-----------------|---------|-------------------|
| MongoDB Atlas 10.60.184.61:27017 | Persistent game data, room state, player stats | Motor (async MongoDB driver) via FastAPI |
| Vercel | Frontend hosting + serverless functions | Auto-deploy on GitHub push |
| GitHub | Source code, CI/CD | mjnhlyxa (GitHub Actions) |

### 2.3 Data Flow Overview

1. User opens URL → Vercel serves Next.js app
2. App loads in browser → generates anonymous playerId (UUID in localStorage)
3. User creates/joins room → FastAPI creates room in MongoDB, returns room code
4. Two players in room → Game starts, board initialized
5. Player makes move → WebSocket message to FastAPI → server validates move → broadcasts to both players
6. Game state updated in MongoDB after each move
7. Game ends → result saved, shown to both players, room archived

### 2.4 Key Non-Functional Requirements

- **Performance**: First contentful paint < 2s, time to interactive < 3s
- **Scalability**: Support 50 concurrent games (100 players)
- **Availability**: 99.5% uptime (Vercel SLA)
- **Data Persistence**: All game data persists across sessions
- **Mobile Support**: Full gameplay at 375px viewport
- **Latency**: Move confirmation < 200ms for local games, < 500ms for remote

---

## 3. Technology Stack Summary

| Layer | Technology | Version | Notes |
|-------|-----------|--------|-------|
| Monorepo | Bun | 1.x | Workspace management |
| Frontend | Next.js 14 | 14+ | App Router, Server Components |
| Frontend Language | TypeScript | 5.x | Strict mode |
| Frontend Styling | Tailwind CSS | 3.x | Mobile-first responsive |
| Backend | FastAPI | 0.110+ | Python async web framework |
| Backend Language | Python | 3.11+ | Type hints, async/await |
| Database | MongoDB | 6.x | Document store |
| DB Driver | Motor | 3.3+ | Async MongoDB driver |
| Real-time | WebSocket (fastapi websockets) | — | Full-duplex communication |
| Hosting | Vercel | — | Serverless + static |
| AI | Python minimax | — | Alpha-beta pruning with piece-square tables |

---

## 4. Game Rules Reference (Co Tuong Sam)

### Board Setup (9 columns x 10 rows)
- Columns: 0-8 (or a-i in Vietnamese notation)
- Rows: 0-9 (rank 10 to 1, bottom to top)
- River: Row 4 (divides red and black territories)

### Pieces per Side (16 total)

| Piece | Vietnamese | Notation | Count | Movement |
|-------|-----------|----------|-------|----------|
| Sâm | Commander | CT | 1 | Like King — any direction 1 square, cannot leave palace |
| Sĩ | Advisor | S | 2 | Diagonal 1 square, cannot leave palace |
| Xe | Minister | X | 2 | Any number of squares horizontally or vertically |
| Mã | Horse | M | 2 | 2 squares in direction + 1 square perpendicular (L-shape) |
| Pháo | Cannon | P | 2 | Any number of squares horizontally/vertically; must jump exactly 1 piece to capture |
| Tốt | Soldier | T | 5 | 1 square forward only; after crossing river, can also move diagonally forward |

### Special Rules

1. **Palace (Cung)**: King (Sâm) and Advisors (Sĩ) must stay within their palace (rows 0-2 for black, rows 7-9 for red; columns 3-5)
2. **River**: Horizontal line between row 4 and row 5
3. **Soldier Crossing**: Until row 4, Tốt can only move forward. After crossing river (row 5-9), can also move diagonally forward
4. **Sâm Sacrifice**: When Sâm is in checkmate (no legal moves), player may sacrifice Sâm to capture opponent's King — this is a winning move
5. **Win Conditions**:
   - Capture opponent's Sâm
   - Capture opponent's King (via Sâm sacrifice in checkmate)
   - Opponent has no legal moves while in check

### Initial Board Position

```
Black (Negatives) — Top of board (row 0)
    0   1   2   3   4   5   6   7   8
0 [  ] [  ] [  ] [CT] [  ] [CT] [  ] [  ] [  ]    <- Sâm palace at col 3,4,5
1 [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ]    <- Empty row
2 [  ] [  ] [  ] [ S ] [  ] [ S ] [  ] [  ] [  ]    <- Advisors at col 3,5
3 [ X ] [  ] [ M ] [  ] [  ] [  ] [ M ] [  ] [ X ]    <- Ministers, Horses, empty
4 [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ]    <- River row
5 [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ]    <- River row
6 [ x ] [  ] [ m ] [  ] [  ] [  ] [ m ] [  ] [ x ]    <- Black pieces mirrored
7 [  ] [  ] [ s ] [  ] [  ] [  ] [ s ] [  ] [  ]    <- Lowercase = Black
8 [  ] [  ] [  ] [ ct] [  ] [ ct] [  ] [  ] [  ]    
9 [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ]    

Red (Capitals) — Bottom of board (row 9)
```

---

## 5. Security Considerations

- Anonymous player IDs (UUID v4) — no PII stored
- No authentication required for core gameplay
- Input validation on all API endpoints (Pydantic models)
- WebSocket message validation (schema validation)
- Rate limiting on API routes via FastAPI middleware
- Board coordinate validation (0-8 for col, 0-9 for row)
- Move validation server-side (client can be exploited)

---

## 6. Cost Projection (Development/Production)

| Service | Plan | Projected Usage | Notes |
|---------|------|----------------|-------|
| Vercel | Free (Hobby) | 100GB bandwidth/mo | Should be sufficient for < 100 concurrent users |
| MongoDB | 10.60.184.61:27017 (self-hosted) | Local instance | No cloud costs |
| GitHub | Free | — | Repository hosting |

---

## 7. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| WebSocket connection limits | Medium | Medium | Implement heartbeat, auto-reconnect with exponential backoff |
| Move validation bugs | Medium | High | Extensive unit tests for all piece movement rules |
| Sâm sacrifice edge cases | High | High | Thorough test coverage of checkmate + sacrifice scenarios |
| Concurrent game limit | Low | Medium | Monitor MongoDB connections, implement game room limits |
| AI performance | Medium | Low | Start with random-move AI, upgrade to minimax post-MVP |
| Player disconnection | Medium | Medium | 60s timeout, offer rematch option |

---

## 8. Open Questions (Resolved in Plan)

| Question | Decision |
|----------|----------|
| Sâm English name | "Commander" (CT abbreviation) |
| River rule for Soldiers | Exactly as Xiangqi: forward only until crossed river (row 5+), then diagonal allowed |
| Time control | Unlimited (no clock for v1) |
| Draw detection | 3-fold repetition auto-draw, or manual draw offer |
| Board notation | Use algebraic (col-row) internally, Vietnamese for display |