export type GamePhase = 'UNTAP' | 'UPKEEP' | 'DRAW' | 'MAIN_1' | 'COMBAT' | 'MAIN_2' | 'END';

export interface Player {
  id: string;
  name: string;
  life: number;
  commanderDamage: Record<string, number>;
}

export interface GameState {
  id: string;
  players: string[];
  turn: number;
  phase: GamePhase;
  activePlayer: string;
} 