import { GameState, Move, Position, Side, BOARD_ROWS, BOARD_COLS } from './types';
import { getAllValidMoves, applyMove, isCheckmate, findSâm, wouldBeInCheck } from './moves';

// Validate a move against game state
export function validateMove(
  state: GameState,
  from: Position,
  to: Position,
  playerId: string
): { valid: boolean; error?: string } {
  // Check if game is active
  if (state.status !== 'playing') {
    return { valid: false, error: 'Game is not active' };
  }

  // Find the piece at from position
  const piece = state.board[from.row][from.col];
  if (!piece) {
    return { valid: false, error: 'No piece at source position' };
  }

  // Check if it's the player's turn based on side assignment
  // For now, we just validate that the piece belongs to the current turn side
  if (piece.side !== state.currentTurn) {
    return { valid: false, error: 'Not your turn' };
  }

  // Check if move is in the list of legal moves for this piece
  const legalMoves = getAllValidMoves(state.board, piece.side);
  const isLegal = legalMoves.some(
    m => m.from.row === from.row && m.from.col === from.col &&
         m.to.row === to.row && m.to.col === to.col
  );

  if (!isLegal) {
    return { valid: false, error: 'Invalid move for this piece' };
  }

  // Check if move would leave Sâm in check (handled by getAllValidMoves but double-check)
  if (wouldBeInCheck(state.board, from, to, piece.side)) {
    return { valid: false, error: 'Move would leave Sâm in check' };
  }

  return { valid: true };
}

// Process a move and return new game state
export function processMove(
  state: GameState,
  from: Position,
  to: Position
): { newState: GameState; move: Move } {
  const piece = state.board[from.row][from.col]!;
  const captured = state.board[to.row][to.col] || undefined;

  const move: Move = {
    from,
    to,
    piece,
    captured,
    isSacrifice: false
  };

  // Apply move to board
  let newBoard = applyMove(state.board, move);

  // Check for Sâm sacrifice win condition
  // When a player's Sâm is in checkmate, they can sacrifice their Sâm to capture opponent's Sâm
  // This is a special winning move

  // Determine next turn
  const nextTurn: Side = state.currentTurn === 'red' ? 'black' : 'red';

  // Check win conditions
  let winner: Side | undefined;
  let endCondition: 'checkmate' | 'sâm-sacrifice' | 'resignation' | 'draw' | undefined;

  // Check if opponent's Sâm was captured
  if (captured && captured.type === 'CT') {
    winner = piece.side;
    endCondition = 'checkmate';
  }

  // Check for checkmate
  if (!winner && isCheckmate(newBoard, nextTurn)) {
    // Check if next player can do Sâm sacrifice
    const nextSâmPos = findSâm(newBoard, nextTurn);
    if (nextSâmPos) {
      // The player is in checkmate. Check if they have the Sâm sacrifice option available
      // This requires that the player's Sâm is on the board and in checkmate position
      // The sacrifice allows them to win by capturing opponent's Sâm instead

      // For now, if the current player captures opponent's Sâm, they win
      if (captured && captured.type === 'CT') {
        winner = piece.side;
        endCondition = 'sâm-sacrifice';
      } else {
        // Checkmate - current player wins
        winner = piece.side;
        endCondition = 'checkmate';
      }
    }
  }

  // Build new state
  const newState: GameState = {
    board: newBoard,
    currentTurn: winner ? state.currentTurn : nextTurn,
    moveHistory: [
      ...state.moveHistory,
      {
        moveNumber: state.moveHistory.length + 1,
        from: `${String.fromCharCode(97 + from.col)}${10 - from.row}`,
        to: `${String.fromCharCode(97 + to.col)}${10 - to.row}`,
        piece: `${piece.side === 'red' ? piece.type : piece.type.toLowerCase()}`,
        capturedPiece: captured ? `${captured.side === 'red' ? captured.type : captured.type.toLowerCase()}` : undefined,
        isSacrifice: move.isSacrifice,
        timestamp: new Date().toISOString()
      }
    ],
    status: winner ? 'finished' : 'playing',
    winner,
    endCondition,
    lastMove: move,
    checkPosition: undefined
  };

  // Add check indicator
  if (!winner && isCheckmate(newBoard, nextTurn) === false) {
    const nextKingPos = findSâm(newBoard, nextTurn);
    if (nextKingPos) {
      newState.checkPosition = nextKingPos;
    }
  }

  return { newState, move };
}

// Check if a side can perform Sâm sacrifice
// This is only allowed when the side's Sâm is in checkmate (no legal moves)
export function canPerformSâmSacrifice(state: GameState, side: Side): boolean {
  // Must have Sâm on board
  const sâmPos = findSâm(state.board, side);
  if (!sâmPos) return false;

  // Must be in checkmate (no legal moves)
  // This requires checking if the Sâm sacrifice move is available
  // The sacrifice allows capturing opponent's Sâm as a winning move

  // For simplicity, we check if the side has no legal moves and their Sâm is present
  // In actual implementation, this would check specific Sâm sacrifice rules
  return false; // Placeholder - Sâm sacrifice needs special handling
}

// Get initial game state
export function createInitialGameState(): GameState {
  // Will be implemented with board creation
  return {
    board: [], // Will be filled by board creation
    currentTurn: 'red',
    moveHistory: [],
    status: 'waiting'
  };
}

// Convert board to string representation for debugging
export function boardToString(board: (import('./types').Piece | null)[][]): string {
  let str = '';
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece) {
        const label = piece.side === 'red' ? piece.type : piece.type.toLowerCase();
        str += label;
      } else {
        str += '.';
      }
      str += ' ';
    }
    str += '\n';
  }
  return str;
}