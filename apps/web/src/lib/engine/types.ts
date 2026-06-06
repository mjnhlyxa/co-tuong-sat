// Piece type enum
export type PieceType = 'CT' | 'S' | 'X' | 'M' | 'P' | 'T';

// Side enum
export type Side = 'red' | 'black';

// Board position
export interface Position {
  row: number; // 0-9 (0 = top/black side)
  col: number; // 0-8 (0 = left/a)
}

// Piece on board
export interface Piece {
  type: PieceType;
  side: Side;
}

// Board is 10 rows x 9 columns (0-indexed internally)
export type Board = (Piece | null)[][];

// Move representation
export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  isSacrifice?: boolean; // Sâm sacrifice move
}

// Game state
export interface GameState {
  board: Board;
  currentTurn: Side;
  moveHistory: MoveRecord[];
  status: 'waiting' | 'playing' | 'finished';
  winner?: Side;
  endCondition?: 'checkmate' | 'sâm-sacrifice' | 'resignation' | 'draw';
  lastMove?: Move;
  checkPosition?: Position; // King position in check
}

// Move record for history
export interface MoveRecord {
  moveNumber: number;
  from: string; // notation like "d1"
  to: string;
  piece: string;
  capturedPiece?: string;
  isSacrifice?: boolean;
  timestamp: string;
}

// Player info
export interface PlayerInfo {
  id: string;
  name: string;
  side: Side;
  connected: boolean;
}

// Room info
export interface RoomInfo {
  id: string;
  roomCode: string;
  name: string;
  isPrivate: boolean;
  status: 'waiting' | 'playing' | 'closed';
  players: {
    red: PlayerInfo | null;
    black: PlayerInfo | null;
  };
  gameId?: string;
}

// Constants
export const BOARD_ROWS = 10;
export const BOARD_COLS = 9;
export const RIVER_ROW = 4; // Row index where river starts (0-indexed)

// Palace positions
export const RED_PALACE_ROWS = [7, 8, 9];
export const RED_PALACE_COLS = [3, 4, 5];
export const BLACK_PALACE_ROWS = [0, 1, 2];
export const BLACK_PALACE_COLS = [3, 4, 5];

// Piece movement vectors
export const PIECE_NOTATION: Record<PieceType, string> = {
  'CT': 'CT', // Sâm (Commander)
  'S': 'S',   // Advisor
  'X': 'X',   // Minister
  'M': 'M',   // Horse
  'P': 'P',   // Cannon
  'T': 'T',   // Soldier
};

// Convert column number to letter
export function colToLetter(col: number): string {
  return String.fromCharCode(97 + col); // a-i
}

// Convert row number to notation (1-10, 1 = top)
export function rowToNotation(row: number): string {
  return String(10 - row);
}

// Convert position to notation (e.g., "d1")
export function positionToNotation(pos: Position): string {
  return `${colToLetter(pos.col)}${rowToNotation(pos.row)}`;
}

// Convert notation to position
export function notationToPosition(notation: string): Position {
  const col = notation.charCodeAt(0) - 97; // a-i
  const row = 10 - parseInt(notation[1]); // 1-10 → 0-9
  return { row, col };
}