# co-tuong-sat

Vietnamese Chess (Cờ Tướng Sâm) - A variant of Chinese Xiangqi with special Sâm Commander rules.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11, Motor (async MongoDB)
- **Database**: MongoDB at 10.60.184.61:27017
- **Monorepo**: Bun workspace

## Quick Start

### Frontend (Next.js)
```bash
cd apps/web
bun install
bun dev
```

### Backend (FastAPI)
```bash
cd apps/api
pip install -r requirements.txt
uvicorn src.main:app --reload --port 3001
```

## Game Rules

Co Tuong Sam is a Vietnamese chess variant with these special rules:

- **Board**: 9 columns x 10 rows with River dividing the two sides
- **Pieces per side** (16 total):
  - CT (Sâm/Commander): Moves 1 square any direction, must stay in palace
  - S (Advisor): Moves diagonally 1 square, must stay in palace
  - X (Minister): Moves any distance horizontally or vertically
  - M (Horse): Moves in L-shape, can be blocked
  - P (Cannon): Moves like Minister, must jump to capture
  - T (Soldier): Moves forward only; after crossing river, can also move diagonally

- **Sâm Sacrifice**: When your Sâm is in checkmate with no legal moves, you may sacrifice your Sâm to capture opponent's Sâm - winning immediately!

- **Win conditions**: Capture opponent's Sâm, checkmate, or resignation

## Project Structure

```
co-tuong-sat/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   ├── components/    # React components
│   │   │   └── lib/engine/   # Pure game logic
│   │   └── package.json
│   │
│   └── api/                   # FastAPI backend
│       ├── src/
│       │   ├── routers/       # API endpoints
│       │   ├── models/       # Pydantic models
│       │   └── db/           # MongoDB connection
│       └── requirements.txt
│
├── plan/                       # Technical planning documents
├── design/                     # UI/UX design documents
├── brainstorm.md
└── README.md
```

## Development

See `plan/` directory for detailed technical specifications.