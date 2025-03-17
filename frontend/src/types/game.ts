export interface CardType {
  id: string;
  name: string;
  imageUrl?: string;
  type: string;
  manaCost?: string;
  text?: string;
  power?: string;
  toughness?: string;
  loyalty?: number;
  colors?: string[];
  colorIdentity?: string[];
  isTapped?: boolean;
  counters?: Record<string, number>;
  attachedTo?: string;
  controller?: string;
  owner?: string;
  faceDown?: boolean;
}

export interface PlayerType {
  id: string;
  name: string;
  life: number;
  isActive: boolean;
  poisonCounters?: number;
  commanderDamage?: Record<string, number>;
  hand?: CardType[];
  library?: CardType[];
  graveyard?: CardType[];
  exile?: CardType[];
  battlefield?: CardType[];
  commandZone?: CardType[];
}

export interface ZoneType {
  name: string;
  cards: CardType[];
  playerId: string;
}

export type PlayerPosition = 'bottom' | 'top' | 'left' | 'right';

export interface GameStateType {
  players: PlayerType[];
  activePlayerId: string;
  phase: string;
  turn: number;
  stack: CardType[];
  battlefield: CardType[];
  commandZone: CardType[];
  exile: CardType[];
}

export interface GameBoardProps {
  gameState?: GameStateType;
}

export interface PlayerAreaProps {
  player: PlayerType;
  position: PlayerPosition;
}

export interface ZoneProps {
  name: string;
  playerId: string;
  cards: CardType[];
  onCardClick?: (card: CardType) => void;
}

export interface CardProps {
  card: CardType;
  isTapped?: boolean;
  isSelected?: boolean;
  onClick?: (card: CardType) => void;
  onContextMenu?: (card: CardType, event: React.MouseEvent) => void;
} 