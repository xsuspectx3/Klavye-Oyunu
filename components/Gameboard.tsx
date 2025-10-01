import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { FallingLetter } from '../types';
import { 
    ALPHABET, 
    GAME_HEIGHT, 
    INITIAL_FALL_SPEED, 
    SPEED_INCREMENT_PER_LEVEL, 
    INITIAL_SPAWN_RATE, 
    SPAWN_RATE_DECREMENT_PER_LEVEL, 
    MIN_SPAWN_RATE,
    BOUNDARY_INCREMENT, 
    SCORE_PER_LETTER,
    LEVEL_UP_SCORE
} from '../constants';

interface GameboardProps {
  onGameOver: (finalScore: number) => void;
}

const PoofAnimation: React.FC<{ id: number }> = ({ id }) => (
    <div key={id} className="absolute text-3xl text-yellow-400 animate-ping opacity-75">✨</div>
);

const Gameboard: React.FC<GameboardProps> = ({ onGameOver }) => {
  const [letters, setLetters] = useState<FallingLetter[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [boundaryHeight, setBoundaryHeight] = useState(0);
  const [poppedLetters, setPoppedLetters] = useState<FallingLetter[]>([]);
  
  const gameLoopRef = useRef<number>();
  // FIX: Changed NodeJS.Timeout to number, which is the correct type for setInterval in the browser.
  const letterSpawnerRef = useRef<number>();

  const fallSpeed = INITIAL_FALL_SPEED + (level - 1) * SPEED_INCREMENT_PER_LEVEL;
  const spawnRate = Math.max(MIN_SPAWN_RATE, INITIAL_SPAWN_RATE - (level - 1) * SPAWN_RATE_DECREMENT_PER_LEVEL);

  const spawnLetter = useCallback(() => {
    const char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    const x = Math.random() * 90 + 5; // 5% to 95% horizontal position
    const newLetter: FallingLetter = { id: Date.now(), char, x, y: -5 };
    setLetters((prev) => [...prev, newLetter]);
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();
    
    // In Turkish, 'i' key produces 'İ' when uppercase. Handle this specifically.
    const targetKey = pressedKey === 'İ' ? 'I' : pressedKey;

    let letterFound = false;
    let lowestFoundLetter: FallingLetter | null = null;

    setLetters(prevLetters => {
        const matchingLetters = prevLetters.filter(l => l.char.toUpperCase() === targetKey);
        if (matchingLetters.length === 0) return prevLetters;

        lowestFoundLetter = matchingLetters.reduce((lowest, current) => current.y > lowest.y ? current : lowest);
        
        if (lowestFoundLetter) {
            letterFound = true;
            setPoppedLetters(prev => [...prev, lowestFoundLetter!]);
            setTimeout(() => setPoppedLetters(prev => prev.filter(p => p.id !== lowestFoundLetter!.id)), 500);
            return prevLetters.filter(l => l.id !== lowestFoundLetter!.id);
        }
        return prevLetters;
    });

    if (letterFound) {
      setScore(prev => prev + SCORE_PER_LETTER);
    }
  }, []);

  useEffect(() => {
    if(score > 0 && score % LEVEL_UP_SCORE === 0) {
        setLevel(prev => prev + 1);
    }
  }, [score]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    letterSpawnerRef.current = setInterval(spawnLetter, spawnRate);
    return () => {
        if (letterSpawnerRef.current) {
            clearInterval(letterSpawnerRef.current);
        }
    };
  }, [spawnLetter, spawnRate]);

  const gameLoop = useCallback(() => {
    setLetters((prevLetters) => {
      let boundaryCollision = false;
      const newLetters = prevLetters
        .map((letter) => ({ ...letter, y: letter.y + fallSpeed }))
        .filter((letter) => {
          if (letter.y >= GAME_HEIGHT - boundaryHeight) {
            boundaryCollision = true;
            return false;
          }
          return true;
        });

      if (boundaryCollision) {
        setBoundaryHeight((prev) => {
            const newBoundary = prev + BOUNDARY_INCREMENT;
            if(newBoundary >= GAME_HEIGHT - 20) {
                // Game Over condition
                if (gameLoopRef.current) {
                    cancelAnimationFrame(gameLoopRef.current);
                }
                if (letterSpawnerRef.current) {
                    clearInterval(letterSpawnerRef.current);
                }
                onGameOver(score);
            }
            return newBoundary;
        });
      }
      return newLetters;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [fallSpeed, boundaryHeight, onGameOver, score]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameLoop]);

  return (
    <div className="relative w-full h-[70vh] max-h-[600px] bg-sky-900/50 rounded-2xl shadow-2xl overflow-hidden border-4 border-white/50">
        {/* Game Stats */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 bg-black/30 p-2 md:p-3 rounded-lg text-white font-bold text-sm md:text-lg flex flex-col gap-1 md:gap-2">
            <div>Skor: <span className="text-yellow-300">{score}</span></div>
            <div>Seviye: <span className="text-green-300">{level}</span></div>
        </div>

      {/* Falling Letters */}
      {letters.map((letter) => (
        <div
          key={letter.id}
          className="absolute flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-indigo-500 rounded-full text-white font-bold text-2xl shadow-lg border-2 border-indigo-300"
          style={{ left: `${letter.x}%`, top: `${letter.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          {letter.char}
        </div>
      ))}

      {/* Poof Animations */}
      {poppedLetters.map((letter) => (
         <div
            key={letter.id}
            className="absolute flex items-center justify-center w-12 h-12 text-yellow-300 text-5xl animate-ping"
            style={{ left: `${letter.x}%`, top: `${letter.y}%`, transform: 'translate(-50%, -50%)' }}
        >
            ✨
        </div>
      ))}

      {/* Danger Zone / Boundary */}
      <div
        className="absolute bottom-0 left-0 w-full bg-red-500/50 border-t-4 border-red-500 transition-all duration-500 ease-out"
        style={{ height: `${boundaryHeight}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-extrabold text-2xl uppercase tracking-widest opacity-50">
            Tehlike
        </div>
      </div>
    </div>
  );
};

export default Gameboard;