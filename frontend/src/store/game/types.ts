import { GameState, GamePhase, PlayerState, ZoneState, CardState } from '../../types/game/GameState';

// Action Types
export const GAME_ACTIONS = {
  // Game Flow
  SET_GAME: 'game/setGame',
  CLEAR_GAME: 'game/clearGame',
  SET_PHASE: 'game/setPhase',
  SET_ACTIVE_PLAYER: 'game/setActivePlayer',
  INCREMENT_TURN: 'game/incrementTurn',
  
  // Player Actions
  UPDATE_PLAYER: 'game/updatePlayer',
  UPDATE_LIFE_TOTAL: 'game/updateLifeTotal',
  UPDATE_COMMANDER_DAMAGE: 'game/updateCommanderDamage',
  
  // Zone Actions
  UPDATE_ZONE: 'game/updateZone',
  MOVE_CARD: 'game/moveCard',
  
  // Card Actions
  UPDATE_CARD: 'game/updateCard',
  TAP_CARD: 'game/tapCard',
  ADD_COUNTER: 'game/addCounter',
  REMOVE_COUNTER: 'game/removeCounter',
  ATTACH_CARD: 'game/attachCard',
  DETACH_CARD: 'game/detachCard'
} as const;

// Action Payload Types
export interface SetPhasePayload {
  phase: GamePhase;
}

export interface UpdatePlayerPayload {
  playerId: string;
  updates: Partial<PlayerState>;
}

export interface UpdateLifeTotalPayload {
  playerId: string;
  delta: number;
}

export interface UpdateCommanderDamagePayload {
  playerId: string;
  commanderId: string;
  damage: number;
}

export interface UpdateZonePayload {
  zoneId: string;
  updates: Partial<ZoneState>;
}

export interface MoveCardPayload {
  cardId: string;
  fromZoneId: string;
  toZoneId: string;
}

export interface UpdateCardPayload {
  cardId: string;
  updates: Partial<CardState>;
}

export interface CardCounterPayload {
  cardId: string;
  counterType: string;
  amount: number;
}

export interface CardAttachmentPayload {
  cardId: string;
  attachmentId: string;
} 