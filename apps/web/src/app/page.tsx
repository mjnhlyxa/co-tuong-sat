'use client';

import { useEffect, useState } from 'react';
import { getOrCreatePlayerId, getPlayerName } from '@/lib/player';

export default function HomePage() {
  const [playerId, setPlayerId] = useState<string>('');
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [showSideSelection, setShowSideSelection] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const id = getOrCreatePlayerId();
    setPlayerId(id);
  }, []);

  const handleCreateRoom = () => {
    // For now, just navigate to a game room with generated code
    const code = generateRoomCode();
    window.location.href = `/game/${code}`;
  };

  const handleJoinRoom = () => {
    if (roomCode.length === 6) {
      window.location.href = `/game/${roomCode.toUpperCase()}`;
    }
  };

  const handlePlayvsAI = () => {
    setShowSideSelection(true);
  };

  const handleSelectSide = (side: 'red' | 'black' | 'random') => {
    // For AI mode, we'll navigate to a special game URL
    window.location.href = `/game/ai-${side || 'random'}`;
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display text-gold mb-2">co-tuong-sat</h1>
        <p className="text-text-secondary">Cờ Tướng Sâm - Vietnamese Chess</p>
      </header>

      {/* Main Actions */}
      <div className="max-w-2xl mx-auto">
        {/* Play vs AI */}
        <div className="card mb-6 text-center">
          <h2 className="text-xl mb-4 text-text-primary">Quick Game</h2>
          <button
            onClick={handlePlayvsAI}
            className="btn-primary text-lg px-8 py-4"
          >
            Play vs AI
          </button>
        </div>

        {/* Create/Join Room */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Create Room */}
          <div className="card">
            <h3 className="text-lg mb-4 text-text-secondary uppercase tracking-wide text-center">
              Multiplayer
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room name (optional)"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="input"
                maxLength={50}
              />
              <button
                onClick={handleCreateRoom}
                className="btn-secondary w-full"
              >
                Create Room
              </button>
            </div>
          </div>

          {/* Join Room */}
          <div className="card">
            <h3 className="text-lg mb-4 text-text-secondary uppercase tracking-wide text-center">
              Join Room
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter 6-character code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
                className="input text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
              <button
                onClick={handleJoinRoom}
                disabled={roomCode.length !== 6}
                className="btn-primary w-full disabled:opacity-50"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>

        {/* Help Button */}
        <div className="text-center">
          <button
            onClick={() => setShowRules(true)}
            className="text-gold hover:text-gold-hover transition-colors"
          >
            ? How to Play
          </button>
        </div>
      </div>

      {/* Side Selection Modal */}
      {showSideSelection && (
        <div className="modal-backdrop" onClick={() => setShowSideSelection(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-display text-gold text-center mb-6">Choose Your Side</h2>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleSelectSide('red')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-surface transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-red flex items-center justify-center text-2xl font-bold text-white border-2 border-gold">
                  T
                </div>
                <span className="text-text-primary">Red</span>
              </button>
              <button
                onClick={() => handleSelectSide('black')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-surface transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-black-piece flex items-center justify-center text-2xl font-bold text-white border-2 border-gray-400">
                  T
                </div>
                <span className="text-text-primary">Black</span>
              </button>
              <button
                onClick={() => handleSelectSide('random')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-surface transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-2xl font-bold text-gold border-2 border-gold">
                  ?
                </div>
                <span className="text-text-primary">Random</span>
              </button>
            </div>
            <button
              onClick={() => setShowSideSelection(false)}
              className="mt-6 text-text-secondary hover:text-text-primary w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRules && (
        <div className="modal-backdrop" onClick={() => setShowRules(false)}>
          <div className="modal-content max-w-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-display text-gold text-center mb-6">How to Play</h2>
            <div className="space-y-4 text-text-secondary max-h-96 overflow-y-auto pr-2">
              <div>
                <h4 className="text-text-primary font-semibold mb-2">Board Setup</h4>
                <p>9x10 board with River dividing the two sides. Each side has 16 pieces.</p>
              </div>

              <div>
                <h4 className="text-text-primary font-semibold mb-2">Pieces</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-red flex items-center justify-center text-white font-bold border border-gold text-xs">CT</span>
                    <span><strong>Commander (Sâm)</strong> — Moves 1 square any direction, must stay in palace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-red flex items-center justify-center text-white font-bold border border-gold text-xs">S</span>
                    <span><strong>Advisor (Sĩ)</strong> — Moves diagonally 1 square, must stay in palace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-red flex items-center justify-center text-white font-bold border border-gold text-xs">X</span>
                    <span><strong>Minister (Xe)</strong> — Moves any distance horizontally or vertically</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-red flex items-center justify-center text-white font-bold border border-gold text-xs">M</span>
                    <span><strong>Horse (Mã)</strong> — Moves in L-shape, can be blocked by &quot;knee&quot; piece</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-red flex items-center justify-center text-white font-bold border border-gold text-xs">P</span>
                    <span><strong>Cannon (Pháo)</strong> — Moves like Xe, must jump to capture</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-red flex items-center justify-center text-white font-bold border border-gold text-xs">T</span>
                    <span><strong>Soldier (Tốt)</strong> — Moves forward only; after crossing river, can also move diagonally</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-text-primary font-semibold mb-2">Special Rules</h4>
                <p><strong>Palace:</strong> Sâm and Advisors must stay within their 3x3 palace area.</p>
                <p><strong>River:</strong> Soldiers cannot move sideways until they cross the river.</p>
                <p className="text-gold"><strong>Sâm Sacrifice:</strong> When your Sâm is in checkmate with no legal moves, you may sacrifice your Sâm to capture the opponent&apos;s Sâm — winning immediately!</p>
              </div>

              <div>
                <h4 className="text-text-primary font-semibold mb-2">Win Conditions</h4>
                <p>• Capture opponent&apos;s Sâm</p>
                <p>• Opponent has no legal moves while in check</p>
                <p>• Opponent resigns</p>
              </div>
            </div>
            <button
              onClick={() => setShowRules(false)}
              className="mt-6 btn-primary w-full"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}