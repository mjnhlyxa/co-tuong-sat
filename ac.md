# Acceptance Criteria — co-tuong-sat

> **Status**: Draft | Created: 2026-05-29 | Based on: brainstorm.md + plan/ + design/
> **Format**: Given-When-Then (BDD)
> **Total ACs**: 78

---

## Table of Contents
1. [Anonymous Identity](#1-anonymous-identity)
2. [Room Management](#2-room-management)
3. [Core Gameplay - Pieces & Movement](#3-core-gameplay---pieces--movement)
4. [Core Gameplay - Game Rules](#4-core-gameplay---game-rules)
5. [Real-time Updates](#5-real-time-updates)
6. [AI Opponent](#6-ai-opponent)
7. [Mobile Experience](#7-mobile-experience)
8. [Error Handling](#8-error-handling)
9. [Data Persistence](#9-data-persistence)
10. [UI States & Components](#10-ui-states--components)

---

## 1. Anonymous Identity

### AC-ID-001: Anonymous player ID is generated on first visit
**Given**: Player opens the game for the first time (no localStorage data)
**When**: The game page loads
**Then**: A unique UUID (v4) is generated and stored in localStorage as `playerId`

### AC-ID-002: Player ID persists across page reloads
**Given**: Player has a `playerId` in localStorage
**When**: Player reloads the page or opens a new browser tab
**Then**: The same `playerId` is retrieved from localStorage and used

### AC-ID-003: Default player name is "Anonymous"
**Given**: Player has no name set in localStorage
**When**: Player joins a room or creates a game
**Then**: The player name displays as "Anonymous"

### AC-ID-004: Player can update display name
**Given**: Player is on profile/settings
**When**: Player enters a new display name and confirms
**Then**: The name is saved to localStorage and used in subsequent games

### AC-ID-005: Player identity shown in room and game
**Given**: Player has a display name "Minh"
**When**: Player creates/joins a room
**Then**: The room shows "Minh" as the player name

---

## 2. Room Management

### AC-ROOM-001: Player can create a public room
**Given**: Player is on the lobby page
**When**: Player clicks "Create Room" and enters "Phòng Test"
**Then**: A new public room named "Phòng Test" is created with a 6-char code (e.g., "ABC123"), and a share link is generated

### AC-ROOM-002: Room name is required
**Given**: Player is on the lobby page and opens the "Create Room" dialog
**When**: Player clicks "Create" without entering a room name
**Then**: An error message "Vui lòng nhập tên phòng" appears below the input field, and the room is not created

### AC-ROOM-003: Room name has max length
**Given**: Player opens the Create Room dialog
**When**: Player enters a room name with more than 50 characters
**Then**: The input is truncated at 50 characters or shows error "Tên phòng tối đa 50 ký tự"

### AC-ROOM-004: Private room does NOT appear in public list
**Given**: Player creates a new room with "Private" checkbox selected
**When**: Other players view the public room list
**Then**: The private room is not visible in the public room list

### AC-ROOM-005: Player can join room via share link
**Given**: Player 1 created a room with code "ABC123" and shared the link
**When**: Player 2 opens the share link (e.g., /game/ABC123)
**Then**: Player 2 joins the room and sees the room status (waiting or game in progress)

### AC-ROOM-006: Room shows correct player count
**Given**: A room has 2 slots and 1 player has joined
**When**: The room list updates
**Then**: The room shows "1/2 người chơi"

### AC-ROOM-007: Joining player gets red side automatically
**Given**: A new room has host assigned to black side
**When**: Another player joins the room
**Then**: The joining player is assigned to red side

### AC-ROOM-008: Second player joining starts the game
**Given**: Room has host (black) waiting, second player joins
**When**: The second player completes joining
**Then**: The game starts automatically, all players see the initial board, and it is red's turn

### AC-ROOM-009: Player can leave room
**Given**: Player is in a room (waiting or playing)
**When**: Player clicks "Leave" or "Back to Lobby"
**Then**: Player is returned to the lobby, and if the room was waiting it is closed

### AC-ROOM-010: Full room rejects new players
**Given**: A room already has 2 players
**When**: A third player tries to join via link
**Then**: The third player sees error "Phòng đã đầy" and is redirected to lobby

---

## 3. Core Gameplay - Pieces & Movement

### AC-GAME-001: Board initializes with correct piece positions
**Given**: A new game starts
**When**: The board is rendered
**Then**: All 16 pieces per side are in correct starting positions:
- CT (Sâm) at columns 3,5 (d1, f1 for red; d10, f10 for black)
- S (Advisor) at columns 3,5 rows 2 and 8
- X (Minister) at columns 0,8 rows 3 and 7
- M (Horse) at columns 1,7 rows 3 and 7
- P (Cannon) at columns 1,7 rows 3 and 7
- T (Soldier) at columns 0,2,4,6,8 row 6 (red) and row 3 (black)

### AC-GAME-002: Sâm (Commander) moves 1 square any direction
**Given**: Red Sâm is at position d1 (row 9, col 3)
**When**: Player selects the Sâm
**Then**: Valid moves are: d2 (forward), c1 (left), e1 (right)
**And**: Sâm cannot move to positions outside its current palace (red palace: rows 7-9, cols 3-5)

### AC-GAME-003: Sâm cannot leave palace
**Given**: Red Sâm is at position d8 (row 2, col 3) — outside palace
**When**: Player tries to move Sâm to position d9 (row 1, col 3)
**Then**: The move is rejected as invalid because Sâm must stay within the 3x3 palace area

### AC-GAME-004: Advisor (Sĩ) moves diagonally 1 square
**Given**: Red Advisor is at position c2 (row 8, col 2)
**When**: Player selects the Advisor
**Then**: Valid moves are only diagonal neighbors: b1, d1, b3, d3 (within palace)

### AC-GAME-005: Advisor cannot leave palace
**Given**: Red Advisor is at position c2
**When**: Player tries to move Advisor to c3 (non-diagonal)
**Then**: The move is rejected as invalid (Advisor can only move diagonally)

### AC-GAME-006: Minister (Xe) moves horizontally/vertically any distance
**Given**: Red Xe is at position a1 (row 9, col 0)
**When**: Player selects the Xe
**Then**: All squares in same row (a2-a10) and same column (b1-i1) are valid moves, blocked by pieces in path

### AC-GAME-007: Xe is blocked by own pieces
**Given**: Red Xe at a1, another red piece at a5
**When**: Player tries to move Xe to a10
**Then**: The move is rejected because path is blocked by own piece at a5

### AC-GAME-008: Horse (Mã) moves in L-shape
**Given**: Red Mã is at position b1 (row 9, col 1)
**When**: Player selects the Mã
**Then**: Valid moves are: a3, c3 (2 forward + 1 sideways), and also: b3 (2 right + 1 up, if not blocked) — total up to 8 possible moves in standard Xiangqi; for Co Tuong Sam verify exact L-pattern implementation

### AC-GAME-009: Mã is blocked by piece at knee position
**Given**: Red Mã is at b1, and there is a piece at a2 (the "knee" position blocking the L-shape)
**When**: Player tries to move Mã to b3 direction
**Then**: The move to b3 is blocked because a2 is occupied

### AC-GAME-010: Cannon (Pháo) moves like Xe but captures differently
**Given**: Red Pháo is at position b1 (row 9, col 1)
**When**: Player selects the Pháo
**Then**: Moving to empty squares requires no jump; moving to capture requires exactly 1 piece between origin and destination

### AC-GAME-011: Cannon must jump to capture
**Given**: Red Pháo at b1, black piece at b5, and there is exactly 1 piece between at b3
**When**: Player moves Pháo from b1 to b5
**Then**: The capture is valid because the jump path has exactly 1 intervening piece

### AC-GAME-012: Cannon capture fails with no jump piece
**Given**: Red Pháo at b1, black piece at b5, no pieces between
**When**: Player tries to capture the piece at b5
**Then**: The move is rejected as invalid (must have exactly 1 jump piece)

### AC-GAME-013: Soldier (Tốt) moves forward only before river
**Given**: Red Soldier is at c7 (row 3, col 2), still on black side of river
**When**: Player selects the Soldier
**Then**: Only valid move is forward to c6 (row 2, col 2) — no sideways, no diagonal

### AC-GAME-014: Soldier can move diagonally after crossing river
**Given**: Red Soldier is at c5 (row 5, col 2) — has crossed the river (row 5+)
**When**: Player selects the Soldier
**Then**: Valid moves are: forward to c4, AND diagonal forward to b4 and d4

### AC-GAME-015: River boundary is correctly enforced
**Given**: Red Soldier is at c4.5 (river row, col 2)
**When**: Player checks valid moves
**Then**: Soldier cannot move sideways (c4 is not valid — sideways moves only allowed at row 5 or above)

---

## 4. Core Gameplay - Game Rules

### AC-GAME-016: Red moves first
**Given**: A new game starts
**When**: The game initializes
**Then**: Red side has the first turn, indicated by "Your turn" on red's panel

### AC-GAME-017: Turn alternates after valid move
**Given**: It is red's turn and red makes a valid move
**When**: The move is confirmed and applied
**Then**: Turn switches to black, black's panel shows "Your turn"

### AC-GAME-018: Invalid move shows error message
**Given**: It's red's turn and red selects a piece
**When**: Red attempts to move to an invalid destination
**Then**: Error message "Nước đi không hợp lệ" appears, piece remains at original position, turn unchanged

### AC-GAME-019: Player cannot move opponent's pieces
**Given**: It is red's turn
**When**: Red clicks on a black piece to select it
**Then**: The black piece is not selected, no error shown (silent rejection)

### AC-GAME-020: Player cannot move out of turn
**Given**: It is black's turn
**When**: Red tries to select and move a red piece
**Then**: The piece can be selected but moving is rejected with error "Chưa đến lượt bạn"

### AC-GAME-021: Check is detected and indicated
**Given**: Red has just made a move that puts black's Sâm in check
**When**: The move is applied
**Then**: Black's Sâm shows red pulsing glow (check indicator), and black's panel shows "Check!"

### AC-GAME-022: Checkmate is detected
**Given**: Black's Sâm is in check and has no legal moves to escape check
**When**: Black's turn begins with no valid moves
**Then**: The game ends immediately with red winning by checkmate

### AC-GAME-023: Sâm sacrifice wins in checkmate position
**Given**: Black's Sâm is in checkmate (no legal moves to escape), but black still has its Sâm on board
**When**: Black exercises Sâm sacrifice option
**Then**: Black sacrifices its Sâm to capture red's Sâm, and black wins immediately

### AC-GAME-024: Sâm sacrifice only valid in checkmate
**Given**: Black's Sâm is in check but has other legal moves available
**When**: Black tries to perform Sâm sacrifice
**Then**: The sacrifice is not allowed; normal move rules apply

### AC-GAME-025: Win by capturing opponent's Sâm
**Given**: A piece captures opponent's Sâm (not via Sâm sacrifice)
**When**: The capture move is applied
**Then**: The game ends immediately, the capturing player wins

### AC-GAME-026: Resignation ends game
**Given**: A player is in an active game
**When**: The player clicks "Resign" and confirms
**Then**: The game ends, opponent wins by resignation

### AC-GAME-027: Draw by mutual agreement
**Given**: An active game
**When**: Both players agree to a draw (one offers, other accepts)
**Then**: The game ends with result "Hòa" (Draw)

### AC-GAME-028: Board flip for black perspective
**Given**: Player chose to play as black (top side)
**When**: The board renders
**Then**: The board is rotated 180 degrees so player's pieces appear at bottom

---

## 5. Real-time Updates

### AC-REALTIME-001: Opponent's move appears within 3 seconds
**Given**: Player 1 and Player 2 are in an active game
**When**: Player 1 makes a move
**Then**: Player 2 sees the new board state within 3 seconds via WebSocket/polling

### AC-REALTIME-002: Game state preserved on reconnection
**Given**: A game is in progress and Player 1 loses connection temporarily
**When**: Player 1 reconnects and opens the game URL
**Then**: The current game state is displayed correctly, including whose turn it is

### AC-REALTIME-003: Player disconnect shows offline indicator
**Given**: A player becomes disconnected (closes tab, loses internet)
**When**: The disconnect is detected (after ~10 seconds)
**Then**: Other players see an "offline" or "Reconnecting..." indicator next to that player's name

### AC-REALTIME-004: Reconnected player can resume
**Given**: Player was disconnected during an active game
**When**: Player reconnects within 60 seconds
**Then**: Player is restored to the game, game continues from current state

### AC-REALTIME-005: Turn indicator updates in real-time
**Given**: It's red's turn
**When**: Red completes a move
**Then**: Black's UI immediately shows "Your turn" indicator (within 3 seconds)

### AC-REALTIME-006: Move history syncs across clients
**Given**: Both players are in an active game with 5 moves made
**When**: Player 1 views move history
**Then**: All 5 moves are visible and match what Player 2 sees

---

## 6. AI Opponent

### AC-AI-001: Player can start game vs AI
**Given**: Player is on lobby page
**When**: Player clicks "Play vs AI"
**Then**: A modal appears with side selection (Red/Black/Random)

### AC-AI-002: AI makes valid moves
**Given**: Player started a game vs AI
**When**: AI takes its turn
**Then**: AI makes only valid moves according to piece movement rules

### AC-AI-003: AI responds within reasonable time
**Given**: Player made a move, it is now AI's turn
**When**: Player waits for AI to move
**Then**: AI makes its move within 5 seconds

### AC-AI-004: AI plays both sides in AI vs AI mode
**Given**: Player selected "AI vs AI" mode (or after player finishes a game vs AI)
**When**: The game runs automatically
**Then**: Both sides make valid moves automatically until game ends

### AC-AI-005: Player can resign vs AI
**Given**: Player is playing vs AI
**When**: Player clicks "Resign"
**Then**: The game ends, AI is declared winner

### AC-AI-006: AI difficulty affects move quality
**Given**: Hard difficulty AI is selected
**When**: AI makes decisions
**Then**: AI uses strategic evaluation (piece-square tables) to choose moves, not random

---

## 7. Mobile Experience

### AC-MOBILE-001: Game is playable at 375px viewport width
**Given**: Player opens the game on a mobile device (375px width)
**When**: Player plays through the full game flow
**Then**: No horizontal scrolling is required, all elements fit on screen

### AC-MOBILE-002: Touch targets are at least 44x44px
**Given**: Player is on a mobile device
**When**: Player taps buttons or game pieces
**Then**: All interactive elements are at least 44x44px in size

### AC-MOBILE-003: Board is properly sized on mobile
**Given**: Player is on a mobile device at 375px width
**When**: Player loads the game board
**Then**: The board is legible (pieces clearly visible with labels), and tappable without accidental adjacent cell selection

### AC-MOBILE-004: Room code input works on mobile
**Given**: Player is on mobile and opens join room screen
**When**: Player enters 6-character room code
**Then**: The input accepts characters, auto-advances between boxes, and submits correctly

### AC-MOBILE-005: Game UI stacks vertically on mobile
**Given**: Player is on mobile at 375px width
**When**: Player is in a game
**Then**: Player panels stack above and below the board (not side-by-side), and move history is in a collapsible drawer

### AC-MOBILE-006: Modals are properly sized on mobile
**Given**: Player is on mobile at 375px width
**When**: Player opens a modal (e.g., How to Play, Game Over)
**Then**: Modal fits within viewport, scrollable if needed, close button easily accessible at top

---

## 8. Error Handling

### AC-ERROR-001: Network error shows retry option
**Given**: Player loses internet connection during a game
**When**: An API call fails due to network error
**Then**: A message "Mất kết nối. Vui lòng kiểm tra internet và thử lại" appears with a "Retry" button

### AC-ERROR-002: Invalid room link shows appropriate message
**Given**: Player opens a link to a non-existent room (e.g., /game/ZZZ999)
**When**: The system tries to load the room
**Then**: Message "Phòng không tồn tại hoặc đã bị xóa" appears with a button to return to lobby

### AC-ERROR-003: Room full rejection
**Given**: A room is already full (2/2 players)
**When**: A third player tries to join via link
**Then**: Message "Phòng đã đầy" appears, player is redirected to lobby

### AC-ERROR-004: Loading states display during async operations
**Given**: Player performs an action that requires server response (create room, join room, make move)
**When**: The request is in flight
**Then**: A loading indicator (spinner or "Đang xử lý...") is displayed on the relevant button or area

### AC-ERROR-005: Invalid move shows specific error
**Given**: Player attempts an invalid move (e.g., moving through pieces)
**When**: The move is submitted to the server
**Then**: Error message specifies why the move failed: "Đường đi bị chặn" (path blocked), "Không thể ra khỏi cung" (cannot leave palace), etc.

### AC-ERROR-006: Session timeout redirects to lobby
**Given**: Player's session has timed out (e.g., after 30 minutes of inactivity)
**When**: Player tries to perform an action
**Then**: Player is redirected to lobby with message "Phiên đã hết hạn"

### AC-ERROR-007: Board state rolls back on server rejection
**Given**: Player made a move that appeared to succeed locally but was rejected by server
**When**: Server returns error for the move
**Then**: The board state is reverted to pre-move state, error message displayed

---

## 9. Data Persistence

### AC-PERSIST-001: Game state survives page refresh
**Given**: A game is in progress (at move 15)
**When**: Player refreshes the page (without clearing localStorage)
**Then**: The game state is restored exactly as it was before refresh (move 15, current turn preserved)

### AC-PERSIST-002: Move history is accurately recorded
**Given**: A game is in progress
**When**: Player makes a move (e.g., red Mã from b1 to b3)
**Then**: The move is recorded in the move history with: move number, piece type, from coordinate, to coordinate, timestamp

### AC-PERSIST-003: Game result is saved after game ends
**Given**: A game ends (by checkmate, resignation, or draw)
**When**: The game ends
**Then**: The result (winner, end condition, move count, timestamp) is saved to MongoDB

### AC-PERSIST-004: Room is removed from public list when game starts
**Given**: A public room has 2 players and the game is about to start
**When**: The second player joins and the game begins
**Then**: The room disappears from the public room list

### AC-PERSIST-005: Player stats are updated after game
**Given**: Player completes a game (win or lose)
**When**: The game ends
**Then**: Player's gamesPlayed count increases, and gamesWon or gamesLost updates accordingly

### AC-PERSIST-006: Completed games are queryable
**Given**: Player has completed 10 games
**When**: Player visits match history
**Then**: All 10 games are listed with date, opponent, result, and can be clicked to view details

---

## 10. UI States & Components

### AC-UI-001: Lobby shows empty state when no rooms
**Given**: No public rooms exist
**When**: Player views the lobby page
**Then**: The public rooms section shows "No rooms available. Create one!" message

### AC-UI-002: Loading spinner appears during room list fetch
**Given**: Player opens the lobby page
**When**: The room list is being fetched
**Then**: A loading indicator or "Loading rooms..." text appears in the room list area

### AC-UI-003: Piece selection shows valid move indicators
**Given**: Player selects a piece that has 3 valid destination squares
**When**: The piece is selected
**Then**: Green dot indicators appear on each valid destination square

### AC-UI-004: Selected piece has gold ring highlight
**Given**: Player selects their piece
**When**: The piece is highlighted as selected
**Then**: The piece has a visible gold ring (box-shadow) around it

### AC-UI-005: Last move is highlighted on board
**Given**: A move was just made from position d1 to d2
**When**: The board renders after the move
**Then**: Both d1 and d2 have subtle yellow highlight (showing the "from" and "to" of the last move)

### AC-UI-006: Game Over modal shows winner and condition
**Given**: Game ended with black winning by checkmate
**When**: The Game Over screen appears
**Then**: "BLACK WINS!" is displayed in black color, "Checkmate" shown as the condition, and action buttons (Rematch, Share, Back to Lobby) are available

### AC-UI-007: Captured pieces display in player panel
**Given**: Red has captured a black Cannon (P) and a black Soldier (T)
**When**: Red's player panel renders
**Then**: Small icons of captured P and T appear in the "Captured" section of red's panel

### AC-UI-008: Room card shows correct status badge
**Given**: A room is waiting for second player
**When**: The room card renders in the lobby list
**Then**: The badge shows green "Waiting" status

**Given**: A room has an active game in progress
**When**: The room card renders
**Then**: The badge shows yellow "In Game" status, and Join button is disabled

### AC-UI-009: Toast notifications appear for errors
**Given**: Player tries to join a room that doesn't exist
**When**: The system returns error
**Then**: A toast notification appears at bottom of screen with error message, auto-dismissing after 3 seconds

### AC-UI-010: How to Play modal explains Sâm sacrifice
**Given**: Player clicks the "?" help button
**When**: The How to Play modal opens
**Then**: The Sâm sacrifice rule is clearly explained with an example diagram

---

## AC Summary

| AC ID | Feature | Priority | Tested |
|-------|---------|----------|--------|
| AC-ID-001 | Anonymous ID generation | Must Have | ❌ |
| AC-ID-002 | Player ID persistence | Must Have | ❌ |
| AC-ID-003 | Default player name | Must Have | ❌ |
| AC-ID-004 | Update display name | Nice to Have | ❌ |
| AC-ID-005 | Player identity in room | Must Have | ❌ |
| AC-ROOM-001 | Create public room | Must Have | ❌ |
| AC-ROOM-002 | Room name required | Must Have | ❌ |
| AC-ROOM-003 | Room name max length | Must Have | ❌ |
| AC-ROOM-004 | Private room hidden | Must Have | ❌ |
| AC-ROOM-005 | Join via share link | Must Have | ❌ |
| AC-ROOM-006 | Player count display | Must Have | ❌ |
| AC-ROOM-007 | Auto-assign sides | Must Have | ❌ |
| AC-ROOM-008 | Game auto-starts | Must Have | ❌ |
| AC-ROOM-009 | Leave room | Must Have | ❌ |
| AC-ROOM-010 | Full room rejection | Must Have | ❌ |
| AC-GAME-001 | Board initialization | Must Have | ❌ |
| AC-GAME-002 | Sâm movement | Must Have | ❌ |
| AC-GAME-003 | Sâm palace restriction | Must Have | ❌ |
| AC-GAME-004 | Advisor movement | Must Have | ❌ |
| AC-GAME-005 | Advisor palace restriction | Must Have | ❌ |
| AC-GAME-006 | Minister movement | Must Have | ❌ |
| AC-GAME-007 | Minister blocked | Must Have | ❌ |
| AC-GAME-008 | Horse movement | Must Have | ❌ |
| AC-GAME-009 | Horse blocked | Must Have | ❌ |
| AC-GAME-010 | Cannon movement | Must Have | ❌ |
| AC-GAME-011 | Cannon capture | Must Have | ❌ |
| AC-GAME-012 | Cannon requires jump | Must Have | ❌ |
| AC-GAME-013 | Soldier forward only | Must Have | ❌ |
| AC-GAME-014 | Soldier diagonal after river | Must Have | ❌ |
| AC-GAME-015 | River boundary | Must Have | ❌ |
| AC-GAME-016 | Red moves first | Must Have | ❌ |
| AC-GAME-017 | Turn alternation | Must Have | ❌ |
| AC-GAME-018 | Invalid move error | Must Have | ❌ |
| AC-GAME-019 | Cannot move opponent pieces | Must Have | ❌ |
| AC-GAME-020 | Cannot move out of turn | Must Have | ❌ |
| AC-GAME-021 | Check detection | Must Have | ❌ |
| AC-GAME-022 | Checkmate detection | Must Have | ❌ |
| AC-GAME-023 | Sâm sacrifice | Must Have | ❌ |
| AC-GAME-024 | Sâm sacrifice only in checkmate | Must Have | ❌ |
| AC-GAME-025 | Win by capture | Must Have | ❌ |
| AC-GAME-026 | Resignation | Must Have | ❌ |
| AC-GAME-027 | Draw by agreement | Must Have | ❌ |
| AC-GAME-028 | Board flip | Must Have | ❌ |
| AC-REALTIME-001 | Opponent move sync | Must Have | ❌ |
| AC-REALTIME-002 | Reconnection state | Must Have | ❌ |
| AC-REALTIME-003 | Disconnect indicator | Must Have | ❌ |
| AC-REALTIME-004 | Resume after reconnect | Must Have | ❌ |
| AC-REALTIME-005 | Turn indicator sync | Must Have | ❌ |
| AC-REALTIME-006 | Move history sync | Must Have | ❌ |
| AC-AI-001 | Start vs AI | Must Have | ❌ |
| AC-AI-002 | AI valid moves | Must Have | ❌ |
| AC-AI-003 | AI response time | Must Have | ❌ |
| AC-AI-004 | AI vs AI mode | Nice to Have | ❌ |
| AC-AI-005 | Resign vs AI | Must Have | ❌ |
| AC-AI-006 | AI difficulty | Nice to Have | ❌ |
| AC-MOBILE-001 | 375px playable | Must Have | ❌ |
| AC-MOBILE-002 | Touch targets 44px | Must Have | ❌ |
| AC-MOBILE-003 | Board sizing | Must Have | ❌ |
| AC-MOBILE-004 | Mobile room code input | Must Have | ❌ |
| AC-MOBILE-005 | Vertical stack | Must Have | ❌ |
| AC-MOBILE-006 | Modal sizing | Must Have | ❌ |
| AC-ERROR-001 | Network error retry | Must Have | ❌ |
| AC-ERROR-002 | Invalid room message | Must Have | ❌ |
| AC-ERROR-003 | Room full message | Must Have | ❌ |
| AC-ERROR-004 | Loading states | Must Have | ❌ |
| AC-ERROR-005 | Invalid move specific error | Must Have | ❌ |
| AC-ERROR-006 | Session timeout | Nice to Have | ❌ |
| AC-ERROR-007 | Rollback on rejection | Must Have | ❌ |
| AC-PERSIST-001 | Page refresh state | Must Have | ❌ |
| AC-PERSIST-002 | Move history | Must Have | ❌ |
| AC-PERSIST-003 | Game result saved | Must Have | ❌ |
| AC-PERSIST-004 | Room removed on start | Must Have | ❌ |
| AC-PERSIST-005 | Player stats update | Nice to Have | ❌ |
| AC-PERSIST-006 | Match history query | Nice to Have | ❌ |
| AC-UI-001 | Empty room state | Must Have | ❌ |
| AC-UI-002 | Loading spinner | Must Have | ❌ |
| AC-UI-003 | Valid move indicators | Must Have | ❌ |
| AC-UI-004 | Selected piece highlight | Must Have | ❌ |
| AC-UI-005 | Last move highlight | Must Have | ❌ |
| AC-UI-006 | Game Over modal | Must Have | ❌ |
| AC-UI-007 | Captured pieces display | Must Have | ❌ |
| AC-UI-008 | Room status badge | Must Have | ❌ |
| AC-UI-009 | Toast notifications | Must Have | ❌ |
| AC-UI-010 | How to Play Sâm rule | Must Have | ❌ |

## Notes

- **Sâm sacrifice rule**: The Sâm (Commander) replaces the General in Co Tuong Sam. When in checkmate with no legal moves, the player may sacrifice their Sâm to capture the opponent's Sâm — winning immediately. This is the key differentiator from standard Xiangqi.
- **River rule**: Soldiers can only move forward (1 square per turn) on their own side of the river. After crossing to the opponent's side (row 5+), they can also move diagonally forward (1 square).
- **Palace**: Sâm and Sĩ must stay within their 3x3 palace. Red palace is rows 7-9, cols 3-5. Black palace is rows 0-2, cols 3-5.
- **Turn enforcement**: Server must be the source of truth for turn validation — client can be exploited.
- **Real-time**: For MVP, polling every 3 seconds is acceptable. WebSocket/SSE enhancement can come post-MVP if latency issues arise.