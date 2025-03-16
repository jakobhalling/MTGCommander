import { Store } from '@reduxjs/toolkit';
import { GameState } from '../types/game/GameState';
import { moveCard, tapCard } from '../store/game/gameSlice';

/**
 * Action Types Enum
 */
export enum ActionType {
  MOVE_CARD = 'MOVE_CARD',
  TAP_CARD = 'TAP_CARD',
  ADD_COUNTER = 'ADD_COUNTER',
  REMOVE_COUNTER = 'REMOVE_COUNTER',
  ATTACH_CARD = 'ATTACH_CARD',
  DETACH_CARD = 'DETACH_CARD',
}

/**
 * Base Action Interface
 */
export interface IGameAction {
  type: ActionType;
  playerId: string;
}

/**
 * Move Card Action
 */
export interface MoveCardAction extends IGameAction {
  type: ActionType.MOVE_CARD;
  cardId: string;
  sourceZoneId: string;
  targetZoneId: string;
}

/**
 * Tap Card Action
 */
export interface TapCardAction extends IGameAction {
  type: ActionType.TAP_CARD;
  cardId: string;
}

/**
 * Add Counter Action
 */
export interface AddCounterAction extends IGameAction {
  type: ActionType.ADD_COUNTER;
  cardId: string;
  counterType: string;
  amount: number;
}

/**
 * Remove Counter Action
 */
export interface RemoveCounterAction extends IGameAction {
  type: ActionType.REMOVE_COUNTER;
  cardId: string;
  counterType: string;
  amount: number;
}

/**
 * Attach Card Action
 */
export interface AttachCardAction extends IGameAction {
  type: ActionType.ATTACH_CARD;
  cardId: string;
  targetCardId: string;
}

/**
 * Detach Card Action
 */
export interface DetachCardAction extends IGameAction {
  type: ActionType.DETACH_CARD;
  cardId: string;
  attachmentId: string;
}

/**
 * Union type of all possible game actions
 */
export type GameAction = 
  | MoveCardAction
  | TapCardAction
  | AddCounterAction
  | RemoveCounterAction
  | AttachCardAction
  | DetachCardAction;

/**
 * Action Validation Result
 */
export interface ActionValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Action Execution Result
 */
export interface ActionExecutionResult {
  success: boolean;
  errors: string[];
}

/**
 * Create a new action
 * @param action The action to create
 * @returns The created action
 */
export function createAction<T extends GameAction>(action: T): T {
  return { ...action };
}

/**
 * Validate an action against the current game state
 * @param action The action to validate
 * @param gameState The current game state
 * @returns Validation result
 */
export function validateAction(action: GameAction, gameState: GameState): ActionValidationResult {
  const errors: string[] = [];

  // Check if gameState is valid
  if (!gameState || !gameState.players) {
    errors.push('Invalid game state');
    return {
      isValid: false,
      errors
    };
  }

  // Common validation for all actions
  if (!gameState.players[action.playerId]) {
    errors.push('Player not found');
  }

  // Action-specific validation
  switch (action.type) {
    case ActionType.MOVE_CARD:
      validateMoveCardAction(action as MoveCardAction, gameState, errors);
      break;
    case ActionType.TAP_CARD:
      validateTapCardAction(action as TapCardAction, gameState, errors);
      break;
    case ActionType.ADD_COUNTER:
    case ActionType.REMOVE_COUNTER:
      validateCounterAction(
        action as AddCounterAction | RemoveCounterAction, 
        gameState, 
        errors
      );
      break;
    case ActionType.ATTACH_CARD:
    case ActionType.DETACH_CARD:
      validateAttachmentAction(
        action as AttachCardAction | DetachCardAction, 
        gameState, 
        errors
      );
      break;
    default:
      errors.push('Unknown action type');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Execute an action
 * @param action The action to execute
 * @param store The Redux store
 * @returns Execution result
 */
export function executeAction(
  action: GameAction, 
  store: Store
): ActionExecutionResult {
  // Validate the action first
  const gameState = store.getState()?.game?.currentGame;
  if (!gameState) {
    return {
      success: false,
      errors: ['No active game']
    };
  }

  const validationResult = validateAction(action, gameState);
  if (!validationResult.isValid) {
    return {
      success: false,
      errors: validationResult.errors
    };
  }

  // Execute the action
  try {
    switch (action.type) {
      case ActionType.MOVE_CARD:
        executeMoveCardAction(action as MoveCardAction, store);
        break;
      case ActionType.TAP_CARD:
        executeTapCardAction(action as TapCardAction, store);
        break;
      case ActionType.ADD_COUNTER:
        // Implementation will be added
        break;
      case ActionType.REMOVE_COUNTER:
        // Implementation will be added
        break;
      case ActionType.ATTACH_CARD:
        // Implementation will be added
        break;
      case ActionType.DETACH_CARD:
        // Implementation will be added
        break;
    }

    return {
      success: true,
      errors: []
    };
  } catch (error) {
    return {
      success: false,
      errors: [(error as Error).message]
    };
  }
}

/**
 * Validate a move card action
 */
function validateMoveCardAction(
  action: MoveCardAction, 
  gameState: GameState, 
  errors: string[]
): void {
  if (!gameState || !gameState.players) {
    errors.push('Invalid game state');
    return;
  }

  // Find the source zone
  const sourceZone = Object.values(gameState.players)
    .flatMap(player => player && player.zones ? Object.values(player.zones) : [])
    .find(zone => zone && zone.id === action.sourceZoneId);

  if (!sourceZone) {
    errors.push('Source zone not found');
    return;
  }

  // Find the target zone
  const targetZone = Object.values(gameState.players)
    .flatMap(player => player && player.zones ? Object.values(player.zones) : [])
    .find(zone => zone && zone.id === action.targetZoneId);

  if (!targetZone) {
    errors.push('Target zone not found');
    return;
  }

  // Check if the card exists in the source zone
  if (!sourceZone.cards || !sourceZone.cards.includes(action.cardId)) {
    errors.push('Card not found in source zone');
  }

  // Additional validation rules can be added here
  // For example, checking if the player has permission to move the card
}

/**
 * Validate a tap card action
 */
function validateTapCardAction(
  action: TapCardAction, 
  gameState: GameState, 
  errors: string[]
): void {
  if (!gameState || !gameState.players) {
    errors.push('Invalid game state');
    return;
  }

  // Find the card
  const card = findCardInGameState(action.cardId, gameState);
  
  if (!card) {
    errors.push('Card not found');
    return;
  }

  // Check if the card is on the battlefield
  const cardZone = Object.values(gameState.players)
    .flatMap(player => player && player.zones ? Object.values(player.zones) : [])
    .find(zone => zone && zone.cards && zone.cards.includes(action.cardId));

  if (!cardZone || cardZone.type !== 'battlefield') {
    errors.push('Card must be on the battlefield to be tapped');
  }

  // Check if the player controls the card
  // This would require additional card state information
}

/**
 * Validate a counter action
 */
function validateCounterAction(
  action: AddCounterAction | RemoveCounterAction, 
  gameState: GameState, 
  errors: string[]
): void {
  if (!gameState || !gameState.players) {
    errors.push('Invalid game state');
    return;
  }

  // Find the card
  const card = findCardInGameState(action.cardId, gameState);
  
  if (!card) {
    errors.push('Card not found');
    return;
  }

  // Additional validation for counter actions
  if (action.amount <= 0) {
    errors.push('Counter amount must be positive');
  }
}

/**
 * Validate an attachment action
 */
function validateAttachmentAction(
  action: AttachCardAction | DetachCardAction, 
  gameState: GameState, 
  errors: string[]
): void {
  if (!gameState || !gameState.players) {
    errors.push('Invalid game state');
    return;
  }

  // Implementation depends on the specific attachment rules
  // This is a placeholder for future implementation
  errors.push('Attachment actions not yet implemented');
}

/**
 * Execute a move card action
 */
function executeMoveCardAction(action: MoveCardAction, store: Store): void {
  store.dispatch(moveCard({
    cardId: action.cardId,
    fromZoneId: action.sourceZoneId,
    toZoneId: action.targetZoneId
  }));
}

/**
 * Execute a tap card action
 */
function executeTapCardAction(action: TapCardAction, store: Store): void {
  store.dispatch(tapCard(action.cardId));
}

/**
 * Helper function to find a card in the game state
 */
function findCardInGameState(cardId: string, gameState: GameState): boolean {
  if (!gameState || !gameState.players) {
    return false;
  }

  // This is a simplified implementation that just checks if the card ID exists in any zone
  return Object.values(gameState.players)
    .flatMap(player => player && player.zones ? Object.values(player.zones) : [])
    .flatMap(zone => zone && zone.cards ? zone.cards : [])
    .includes(cardId);
} 