
export type GameState = 'start' | 'playing' | 'gameOver';

export interface FallingLetter {
  id: number;
  char: string;
  x: number; // percentage from left
  y: number; // percentage from top
}
