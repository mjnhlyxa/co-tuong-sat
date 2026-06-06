import { Board, Piece, Position, Side, Move, PieceType } from './types';

// Direction vectors
const DIRECTIONS = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

// Check if position is within board bounds
export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 10 && pos.col >= 0 && pos.col < 9;
}

// Get piece at position
export function getPiece(board: Board, pos: Position): Piece | null {
  if (!isValidPosition(pos)) return null;
  return board[pos.row][pos.col];
}

// Check if position is empty
export function isEmpty(board: Board, pos: Position): boolean {
  return getPiece(board, pos) === null;
}

// Get all legal moves for a piece at given position
export function getLegalMoves(
  board: Board,
  pos: Position,
  side: Side
): Position[] {
  const piece = getPiece(board, pos);
  if (!piece || piece.side !== side) return [];

  switch (piece.type) {
    case 'CT': return getSâmMoves(board, pos, side);
    case 'S': return getSĩMoves(board, pos, side);
    case 'X': return getXeMoves(board, pos, side);
    case 'M': return getMãMoves(board, pos, side);
    case 'P': return getPháoMoves(board, pos, side);
    case 'T': return getTốtMoves(board, pos, side);
    default: return [];
  }
}

// Sâm (Commander) - 1 square any direction, must stay in palace
function getSâmMoves(board: Board, pos: Position, side: Side): Position[] {
  const moves: Position[] = [];
  const directions = [
    { row: -1, col: 0 }, { row: 1, col: 0 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: -1, col: -1 }, { row: -1, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 1 }
  ];

  for (const dir of directions) {
    const newPos = { row: pos.row + dir.row, col: pos.col + dir.col };
    if (isValidPosition(newPos) && isInSâmPalace(newPos, side)) {
      const target = getPiece(board, newPos);
      if (!target || target.side !== side) {
        moves.push(newPos);
      }
    }
  }
  return moves;
}

// Check if position is in Sâm's palace
export function isInSâmPalace(pos: Position, side: Side): boolean {
  if (side === 'red') {
    return pos.row >= 7 && pos.row <= 9 && pos.col >= 3 && pos.col <= 5;
  } else {
    return pos.row >= 0 && pos.row <= 2 && pos.col >= 3 && pos.col <= 5;
  }
}

// Sĩ (Advisor) - diagonal 1 square, must stay in palace
function getSĩMoves(board: Board, pos: Position, side: Side): Position[] {
  const moves: Position[] = [];
  const diagonalDirs = [
    { row: -1, col: -1 }, { row: -1, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 1 }
  ];

  for (const dir of diagonalDirs) {
    const newPos = { row: pos.row + dir.row, col: pos.col + dir.col };
    if (isValidPosition(newPos) && isInSĩPalace(newPos, side)) {
      const target = getPiece(board, newPos);
      if (!target || target.side !== side) {
        moves.push(newPos);
      }
    }
  }
  return moves;
}

// Check if position is in Sĩ's palace (same as Sâm's palace for red/black distinction)
export function isInSĩPalace(pos: Position, side: Side): boolean {
  return isInSâmPalace(pos, side); // Same 3x3 palace area
}

// Xe (Minister) - horizontal/vertical any distance, blocked by pieces
function getXeMoves(board: Board, pos: Position, side: Side): Position[] {
  const moves: Position[] = [];
  const straightDirs = [
    { row: -1, col: 0 }, { row: 1, col: 0 },
    { row: 0, col: -1 }, { row: 0, col: 1 }
  ];

  for (const dir of straightDirs) {
    let step = 1;
    while (true) {
      const newPos = { row: pos.row + dir.row * step, col: pos.col + dir.col * step };
      if (!isValidPosition(newPos)) break;

      const target = getPiece(board, newPos);
      if (!target) {
        moves.push(newPos);
      } else {
        if (target.side !== side) {
          moves.push(newPos); // Can capture opponent
        }
        break; // Blocked by any piece
      }
      step++;
    }
  }
  return moves;
}

// Mã (Horse) - L-shape (2+1), can be blocked by "knee" piece
function getMãMoves(board: Board, pos: Position, side: Side): Position[] {
  const moves: Position[] = [];
  // L-shape offsets: 2 in one direction, then 1 perpendicular
  const lOffsets = [
    { first: { row: -2, col: 0 }, knee: { row: -1, col: 0 }, second: [{ row: -1, col: -1 }, { row: -1, col: 1 }] },
    { first: { row: 2, col: 0 }, knee: { row: 1, col: 0 }, second: [{ row: 1, col: -1 }, { row: 1, col: 1 }] },
    { first: { row: 0, col: -2 }, knee: { row: 0, col: -1 }, second: [{ row: -1, col: -1 }, { row: 1, col: -1 }] },
    { first: { row: 0, col: 2 }, knee: { row: 0, col: 1 }, second: [{ row: -1, col: 1 }, { row: 1, col: 1 }] },
  ];

  for (const offset of lOffsets) {
    const kneePos = { row: pos.row + offset.knee.row, col: pos.col + offset.knee.col };
    // Check if knee position is blocked
    if (!isEmpty(board, kneePos)) continue;

    for (const second of offset.second) {
      const newPos = { row: pos.row + offset.first.row + second.row, col: pos.col + offset.first.col + second.col };
      if (isValidPosition(newPos)) {
        const target = getPiece(board, newPos);
        if (!target || target.side !== side) {
          moves.push(newPos);
        }
      }
    }
  }
  return moves;
}

// Pháo (Cannon) - horizontal/vertical, must jump to capture
function getPháoMoves(board: Board, pos: Position, side: Side): Position[] {
  const moves: Position[] = [];
  const straightDirs = [
    { row: -1, col: 0 }, { row: 1, col: 0 },
    { row: 0, col: -1 }, { row: 0, col: 1 }
  ];

  for (const dir of straightDirs) {
    let step = 1;
    let jumped = false;
    while (true) {
      const newPos = { row: pos.row + dir.row * step, col: pos.col + dir.col * step };
      if (!isValidPosition(newPos)) break;

      const target = getPiece(board, newPos);
      if (!jumped) {
        // First phase: looking for jump piece
        if (!target) {
          moves.push(newPos); // Can move to empty square
        } else {
          jumped = true; // Found jump piece, now look for capture
        }
      } else {
        // Second phase: after jump piece, can only capture
        if (target) {
          if (target.side !== side) {
            moves.push(newPos); // Can capture opponent
          }
          break; // Can only capture one piece
        }
      }
      step++;
    }
  }
  return moves;
}

// Tốt (Soldier) - forward only before river, forward + diagonal after
function getTốtMoves(board: Board, pos: Position, side: Side): Position[] {
  const moves: Position[] = [];
  const forward = side === 'red' ? -1 : 1; // Red moves up (negative row), black moves down

  const forwardPos = { row: pos.row + forward, col: pos.col };
  if (isValidPosition(forwardPos)) {
    const target = getPiece(board, forwardPos);
    if (!target || target.side !== side) {
      moves.push(forwardPos);
    }
  }

  // Check if crossed river (for diagonal moves)
  const crossedRiver = side === 'red' ? pos.row <= 4 : pos.row >= 5;

  if (crossedRiver) {
    // After crossing, can also move diagonally forward
    const diagLeft = { row: pos.row + forward, col: pos.col - 1 };
    const diagRight = { row: pos.row + forward, col: pos.col + 1 };

    for (const diag of [diagLeft, diagRight]) {
      if (isValidPosition(diag)) {
        const target = getPiece(board, diag);
        if (!target || target.side !== side) {
          moves.push(diag);
        }
      }
    }
  }

  return moves;
}

// Check if a move would put own Sâm in check
export function wouldBeInCheck(
  board: Board,
  from: Position,
  to: Position,
  side: Side
): boolean {
  // Make a copy of the board with the move applied
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  newBoard[to.row][to.col] = piece;

  // Find own Sâm position
  const sâmPos = findSâm(newBoard, side);
  if (!sâmPos) return false;

  // Check if any opponent piece can capture the Sâm
  return isPositionUnderAttack(newBoard, sâmPos, side === 'red' ? 'black' : 'red');
}

// Find Sâm position on board
export function findSâm(board: Board, side: Side): Position | null {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'CT' && piece.side === side) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

// Check if a position is under attack by given side
export function isPositionUnderAttack(
  board: Board,
  pos: Position,
  attackingSide: Side
): boolean {
  // Check all opponent pieces
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.side === attackingSide) {
        const moves = getLegalMoves(board, { row: r, col: c }, attackingSide);
        if (moves.some(m => m.row === pos.row && m.col === pos.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Find king/general position (for standard chess rules check)
export function findKing(board: Board, side: Side): Position | null {
  // In standard Co Tuong, the Sâm is the king equivalent
  return findSâm(board, side);
}

// Check if side is in check
export function isInCheck(board: Board, side: Side): boolean {
  const kingPos = findKing(board, side);
  if (!kingPos) return false;
  return isPositionUnderAttack(board, kingPos, side === 'red' ? 'black' : 'red');
}

// Check if side has any legal moves (for checkmate detection)
export function hasLegalMoves(board: Board, side: Side): boolean {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.side === side) {
        const moves = getLegalMoves(board, { row: r, col: c }, side);
        const pos = { row: r, col: c };
        // Check if any move would not leave king in check
        for (const move of moves) {
          if (!wouldBeInCheck(board, pos, move, side)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// Check for checkmate
export function isCheckmate(board: Board, side: Side): boolean {
  return isInCheck(board, side) && !hasLegalMoves(board, side);
}

// Check for stalemate (no legal moves but not in check)
export function isStalemate(board: Board, side: Side): boolean {
  return !isInCheck(board, side) && !hasLegalMoves(board, side);
}

// Generate all valid moves for a side (considering check)
export function getAllValidMoves(board: Board, side: Side): Move[] {
  const moves: Move[] = [];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.side === side) {
        const pos = { row: r, col: c };
        const destinations = getLegalMoves(board, pos, side);

        for (const dest of destinations) {
          // Only include if move doesn't leave own Sâm in check
          if (!wouldBeInCheck(board, pos, dest, side)) {
            moves.push({
              from: pos,
              to: dest,
              piece,
              captured: getPiece(board, dest) || undefined
            });
          }
        }
      }
    }
  }
  return moves;
}

// Apply a move to the board
export function applyMove(board: Board, move: Move): Board {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[move.from.row][move.from.col];
  newBoard[move.from.row][move.from.col] = null;
  newBoard[move.to.row][move.to.col] = piece;
  return newBoard;
}