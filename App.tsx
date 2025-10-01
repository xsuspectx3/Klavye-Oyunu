
import React, { useState, useCallback } from 'react';
import Gameboard from './components/Gameboard.tsx';
import StartScreen from './components/StartScreen.tsx';
import GameOverScreen from './components/GameOverScreen.tsx';
import type { GameState } from './types.ts';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);

  const startGame = useCallback(() => {
    setScore(0);
    setGameState('playing');
  }, []);

  const endGame = useCallback((finalScore: number) => {
    setScore(finalScore);
    setGameState('gameOver');
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={startGame} />;
      case 'playing':
        return <Gameboard onGameOver={endGame} />;
      case 'gameOver':
        return <GameOverScreen score={score} onRestart={startGame} />;
      default:
        return <StartScreen onStart={startGame} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-200 to-indigo-300 min-h-screen flex flex-col items-center justify-center font-sans p-4">
        <header className="text-center mb-6">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">Harf Avı</h1>
            <p className="text-indigo-100 text-lg mt-2">Klavyeni Geliştir, Harfleri Yakala!</p>
        </header>
        <main className="w-full max-w-2xl">
            {renderContent()}
        </main>
        <footer className="text-center mt-6 text-white text-sm">
            <p>Çocuklar için klavye alıştırma oyunu.</p>
        </footer>
    </div>
  );
};

export default App;