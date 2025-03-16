export type ZoneType = 'hand' | 'library' | 'graveyard' | 'exile' | 'battlefield' | 'command';

export interface ZoneState {
  id: string;
  type: ZoneType;
  cards: string[]; // Array of card IDs
  ownerId: string;
}

export interface CardState {
  id: string;
  name: string;
  types: string[];
  currentZone: string; // Zone ID
  ownerId: string;
  isTapped: boolean;
  counters: Record<string, number>;
  attachments: string[]; // Array of attached card IDs
}

export interface PlayerState {
  id: string;
  name: string;
  life: number;
  zones: {
    [K in ZoneType]: ZoneState;
  };
  commanderDamage: Record<string, number>; // Map of commander ID to damage amount
}

export type GamePhase = 'untap' | 'upkeep' | 'draw' | 'main1' | 'combat' | 'main2' | 'end' | 'cleanup';

export interface GameState {
  id: string;
  players: Record<string, PlayerState>;
  activePlayer: string;
  turnNumber: number;
  phase: GamePhase;
  stack: string[]; // Array of spell/ability IDs
  turnOrder: string[]; // Array of player IDs in turn order
} 