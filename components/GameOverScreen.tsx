
import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center flex flex-col items-center">
      <h2 className="text-4xl font-bold text-red-600 mb-2">Oyun Bitti!</h2>
      <p className="text-slate-700 text-2xl mb-4">
        Skorun: <span className="font-bold text-indigo-700">{score}</span>
      </p>
      <p className="text-slate-600 mb-6">
        Harika iş! Tekrar oynamak ister misin?
      </p>
      <button
        onClick={onRestart}
        className="px-8 py-4 bg-indigo-500 text-white font-bold text-2xl rounded-xl shadow-lg hover:bg-indigo-600 transform hover:scale-105 transition-transform duration-200"
      >
        Tekrar Oyna
      </button>
    </div>
  );
};

export default GameOverScreen;
