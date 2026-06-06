'use client';

import { Board, Position, Side } from '@/lib/engine/types';

interface GameBoardProps {
  board: Board;
  selectedCell: Position | null;
  validMoves: Position[];
  currentTurn: Side;
  playerSide: Side;
  onCellClick: (row: number, col: number) => void;
  lastMove?: { from: Position; to: Position };
  checkPosition?: Position;
}

export function GameBoard({
  board,
  selectedCell,
  validMoves,
  currentTurn,
  playerSide,
  onCellClick,
  lastMove,
  checkPosition,
}: GameBoardProps) {
  // Check if a position is a valid move destination
  const isValidMove = (row: number, col: number) => {
    return validMoves.some(m => m.row === row && m.col === col);
  };

  // Check if position is last move target
  const isLastMove = (row: number, col: number) => {
    return lastMove && lastMove.to.row === row && lastMove.to.col === col;
  };

  // Check if position is last move source
  const isLastMoveFrom = (row: number, col: number) => {
    return lastMove && lastMove.from.row === row && lastMove.from.col === col;
  };

  return (
    <div className="card p-4">
      {/* Board with coordinates */}
      <div className="relative">
        {/* Column labels */}
        <div className="flex justify-between px-2 mb-1 text-xs text-text-muted font-mono">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].map(col => (
            <span key={col} className="w-10 md:w-12 text-center">{col}</span>
          ))}
        </div>

        {/* Board grid */}
        <div className="relative border-4 border-board-lines bg-board rounded">
          {/* Rows */}
          {Array.from({ length: 10 }, (_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: 9 }, (_, col) => {
                const piece = board[row]?.[col];
                const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                const isValid = isValidMove(row, col);
                const isLast = isLastMove(row, col);
                const isLastFrom = isLastMoveFrom(row, col);
                const isCheck = checkPosition?.row === row && checkPosition?.col === col;

                return (
                  <div
                    key={col}
                    className={`w-10 md:w-12 h-10 md:h-12 border border-board-lines relative ${
                      row === 4 ? 'river-row' : ''
                    } ${row === 5 ? 'river-row' : ''}`}
                    onClick={() => onCellClick(row, col)}
                  >
                    {/* Last move highlight */}
                    {(isLast || isLastFrom) && (
                      <div className="absolute inset-0 bg-gold/20" />
                    )}

                    {/* Valid move indicator */}
                    {isValid && (
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                        piece ? 'bg-red/50' : 'bg-green-500/70'
                      }`} />
                    )}

                    {/* Palace markers */}
                    {isPalaceCorner(row, col) && (
                      <div className="absolute inset-1 palace-mark" />
                    )}

                    {/* Piece */}
                    {piece && (
                      <div
                        className={`piece absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                          piece.side === 'red' ? 'red' : 'black'
                        } ${isSelected ? 'selected' : ''} ${
                          isCheck ? 'in-check' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCellClick(row, col);
                        }}
                      >
                        {piece.type}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* River line */}
          <div className="absolute left-0 right-0 top-[40%] bottom-[40%] pointer-events-none">
            <div className="w-full h-0.5 bg-river/30" />
            <div className="w-full h-0.5 bg-river/30 absolute top-full" />
          </div>
        </div>

        {/* Row labels */}
        <div className="flex flex-col justify-between py-1 absolute left-0 top-0 bottom-0 ml-1">
          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(row => (
            <span key={row} className="text-xs text-text-muted font-mono h-10 md:h-12 flex items-center">
              {row}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Check if position is a palace corner
function isPalaceCorner(row: number, col: number): boolean {
  // Red palace: rows 7-9, cols 3-5
  if (row >= 7 && row <= 9 && col >= 3 && col <= 5) {
    return (row === 7 || row === 9) && (col === 3 || col === 5);
  }
  // Black palace: rows 0-2, cols 3-5
  if (row >= 0 && row <= 2 && col >= 3 && col <= 5) {
    return (row === 0 || row === 2) && (col === 3 || col === 5);
  }
  return false;
}