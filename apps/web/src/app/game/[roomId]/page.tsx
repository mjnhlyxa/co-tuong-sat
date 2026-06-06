'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { createStandardBoard } from '@/lib/engine/board';
import { getAllValidMoves, isCheckmate, wouldBeInCheck } from '@/lib/engine/moves';
import { processMove } from '@/lib/engine/validation';
import { GameState, Position, Side, Move, BOARD_ROWS, BOARD_COLS } from '@/lib/engine/types';
import { getOrCreatePlayerId } from '@/lib/player';

interface PageProps {
  params: { roomId: string };
}

export default function GamePage({ params }: PageProps) {
  const { roomId } = params;
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [playerSide, setPlayerSide] = useState<Side>('red');
  const [showGameOver, setShowGameOver] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playerId = getOrCreatePlayerId();

  // Initialize game
  useEffect(() => {
    const board = createStandardBoard();
    setGameState({
      board,
      currentTurn: 'red',
      moveHistory: [],
      status: 'playing',
    });

    // Check if AI mode
    if (roomId.startsWith('ai-')) {
      setIsAI(true);
      const side = roomId.replace('ai-', '');
      if (side === 'red' || side === 'black') {
        setPlayerSide(side);
      }
    }
  }, [roomId]);

  // Get all valid moves for selected piece
  const getValidMovesForPiece = useCallback((pos: Position) => {
    if (!gameState) return [];
    const piece = gameState.board[pos.row][pos.col];
    if (!piece || piece.side !== gameState.currentTurn) return [];

    return getAllValidMoves(gameState.board, piece.side).filter(
      m => m.from.row === pos.row && m.from.col === pos.col
    ).map(m => m.to);
  }, [gameState]);

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameState || gameState.status === 'finished') return;

    // If it's AI's turn, don't allow manual moves
    if (isAI && gameState.currentTurn !== playerSide) return;

    const clickedPos = { row, col };
    const clickedPiece = gameState.board[row][col];

    // If we have a selected piece
    if (selectedCell) {
      const selectedPiece = gameState.board[selectedCell.row][selectedCell.col];

      // Check if clicking on own piece to change selection
      if (clickedPiece && clickedPiece.side === selectedPiece?.side) {
        setSelectedCell(clickedPos);
        setValidMoves(getValidMovesForPiece(clickedPos));
        return;
      }

      // Check if valid move
      const isValidMove = validMoves.some(m => m.row === row && m.col === col);
      if (isValidMove) {
        // Make the move
        makeMove(selectedCell, clickedPos);
        return;
      }

      // Clicking elsewhere deselects
      setSelectedCell(null);
      setValidMoves([]);
      return;
    }

    // If clicking on own piece, select it
    if (clickedPiece && clickedPiece.side === gameState.currentTurn) {
      setSelectedCell(clickedPos);
      setValidMoves(getValidMovesForPiece(clickedPos));
    }
  }, [gameState, selectedCell, validMoves, playerSide, isAI, getValidMovesForPiece]);

  // Make a move
  const makeMove = useCallback((from: Position, to: Position) => {
    if (!gameState) return;

    const { newState, move } = processMove(gameState, from, to);
    setGameState(newState);
    setSelectedCell(null);
    setValidMoves([]);

    // Check for game over
    if (newState.status === 'finished') {
      setShowGameOver(true);
    }
  }, [gameState]);

  // AI move logic
  useEffect(() => {
    if (!isAI || !gameState || gameState.status === 'finished') return;
    if (gameState.currentTurn === playerSide) return; // Wait for human

    // Make AI move after delay
    const timer = setTimeout(() => {
      const aiSide = playerSide === 'red' ? 'black' : 'red';
      const moves = getAllValidMoves(gameState.board, aiSide);
      if (moves.length > 0) {
        // Pick a random move
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        makeMove(randomMove.from, randomMove.to);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState, isAI, playerSide, makeMove]);

  // Handle resign
  const handleResign = () => {
    if (!gameState) return;
    const winner = gameState.currentTurn === 'red' ? 'black' : 'red';
    setGameState({
      ...gameState,
      status: 'finished',
      winner,
      endCondition: 'resignation'
    });
    setShowGameOver(true);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading game...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <a href="/" className="text-gold hover:text-gold-hover transition-colors">
          ← Lobby
        </a>
        <span className="font-mono text-gold bg-surface px-3 py-1 rounded">
          {roomId}
        </span>
        <button
          onClick={() => setShowGameOver(true)}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          ? Rules
        </button>
      </header>

      {/* Error display */}
      {error && (
        <div className="bg-red/20 border border-red text-red px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Game Board */}
      <div className="max-w-lg mx-auto">
        {/* Opponent panel */}
        <PlayerPanel
          name={isAI ? 'AI' : 'Opponent'}
          side={playerSide === 'red' ? 'black' : 'red'}
          isCurrentTurn={gameState.currentTurn !== playerSide}
          capturedPieces={[]}
        />

        {/* Board */}
        <GameBoard
          board={gameState.board}
          selectedCell={selectedCell}
          validMoves={validMoves}
          currentTurn={gameState.currentTurn}
          playerSide={playerSide}
          onCellClick={handleCellClick}
          lastMove={gameState.lastMove}
          checkPosition={gameState.checkPosition}
        />

        {/* Player panel */}
        <PlayerPanel
          name={getOrCreatePlayerId().slice(0, 8)}
          side={playerSide}
          isCurrentTurn={gameState.currentTurn === playerSide}
          capturedPieces={[]}
        />

        {/* Move history */}
        <div className="card mt-4">
          <h3 className="text-sm text-text-secondary uppercase tracking-wide mb-2">
            Move History
          </h3>
          {gameState.moveHistory.length === 0 ? (
            <div className="text-text-muted text-sm">No moves yet</div>
          ) : (
            <div className="max-h-32 overflow-y-auto text-sm font-mono">
              {gameState.moveHistory.map((move, i) => (
                <div key={i} className={move.piece === move.piece.toUpperCase() ? 'text-red' : 'text-black-light'}>
                  <span className="text-text-muted">{move.moveNumber}.</span>{' '}
                  {move.piece}: {move.from} → {move.to}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-4">
          <button onClick={handleResign} className="btn-danger flex-1">
            Resign
          </button>
        </div>
      </div>

      {/* Game Over Modal */}
      {showGameOver && gameState.status === 'finished' && (
        <div className="modal-backdrop">
          <div className="modal-content text-center">
            <div className="text-4xl mb-4">
              {gameState.winner === playerSide ? '🏆' : '😔'}
            </div>
            <h2 className={`text-3xl font-display mb-2 ${
              gameState.winner === 'red' ? 'text-red' : 'text-text-primary'
            }`}>
              {gameState.winner === playerSide ? 'YOU WIN!' : 'YOU LOSE'}
            </h2>
            <p className="text-text-secondary mb-4">
              {gameState.endCondition === 'checkmate' && 'Checkmate'}
              {gameState.endCondition === 'sâm-sacrifice' && 'Sâm Sacrifice!'}
              {gameState.endCondition === 'resignation' && 'Opponent resigned'}
            </p>
            <p className="text-text-muted text-sm mb-6">
              {gameState.moveHistory.length} moves
            </p>
            <div className="space-y-3">
              <a href="/" className="btn-primary block w-full">
                Back to Lobby
              </a>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary w-full"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Player panel component
interface PlayerPanelProps {
  name: string;
  side: Side;
  isCurrentTurn: boolean;
  capturedPieces: string[];
}

function PlayerPanel({ name, side, isCurrentTurn, capturedPieces }: PlayerPanelProps) {
  return (
    <div className={`card mb-2 flex items-center gap-4 ${
      isCurrentTurn ? 'border-gold shadow-[0_0_12px_rgba(212,175,55,0.3)]' : ''
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
        side === 'red'
          ? 'bg-red text-white border-2 border-gold'
          : 'bg-black-piece text-white border-2 border-gray-400'
      }`}>
        {name[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className={`text-sm ${isCurrentTurn ? 'text-gold font-semibold' : 'text-text-secondary'}`}>
          {isCurrentTurn ? '● Your turn' : 'Waiting...'}
        </div>
      </div>
      {capturedPieces.length > 0 && (
        <div className="flex gap-1">
          {capturedPieces.map((p, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                p === p.toUpperCase() ? 'bg-red' : 'bg-black-piece'
              } text-white opacity-70`}
            >
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}