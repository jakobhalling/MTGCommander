import { Middleware } from 'redux';
import { RootState } from '../store';
import { GAME_ACTIONS } from '../store/game/types';

/**
 * Validates game state actions before they are processed
 * Prevents invalid state transitions and ensures data integrity
 */
const validationMiddleware: Middleware = store => next => (action: any) => {
  // Skip validation for non-game actions
  if (!action.type || !Object.values(GAME_ACTIONS).includes(action.type)) {
    return next(action);
  }

  const state = store.getState() as RootState;
  const { currentGame } = state.game;

  // Skip validation if no game is in progress
  if (!currentGame && action.type !== GAME_ACTIONS.SET_GAME) {
    console.warn(`Action ${action.type} ignored: No active game`);
    return action;
  }

  // Validate specific action types
  if (currentGame) {
    switch (action.type) {
      case GAME_ACTIONS.MOVE_CARD: {
        const { cardId, fromZoneId, toZoneId } = action.payload;
        
        // Validate card exists in source zone
        const fromZone = Object.values(currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .find(zone => zone.id === fromZoneId);
        
        if (!fromZone || !fromZone.cards.includes(cardId)) {
          console.error(`Invalid card movement: Card ${cardId} not found in zone ${fromZoneId}`);
          return action;
        }
        
        // Validate destination zone exists
        const toZone = Object.values(currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .find(zone => zone.id === toZoneId);
        
        if (!toZone) {
          console.error(`Invalid card movement: Destination zone ${toZoneId} not found`);
          return action;
        }
        
        break;
      }
      
      case GAME_ACTIONS.UPDATE_LIFE_TOTAL: {
        const { playerId, delta } = action.payload;
        
        // Validate player exists
        if (!currentGame.players[playerId]) {
          console.error(`Invalid life total update: Player ${playerId} not found`);
          return action;
        }
        
        // Validate life total won't go negative (unless game rules allow it)
        const newLifeTotal = currentGame.players[playerId].life + delta;
        if (newLifeTotal < 0) {
          console.warn(`Life total would go negative for player ${playerId}`);
          // Allow it to proceed, but log a warning
        }
        
        break;
      }
      
      case GAME_ACTIONS.UPDATE_COMMANDER_DAMAGE: {
        const { playerId, commanderId, damage } = action.payload;
        
        // Validate player exists
        if (!currentGame.players[playerId]) {
          console.error(`Invalid commander damage update: Player ${playerId} not found`);
          return action;
        }
        
        // Validate damage is not negative
        if (damage < 0) {
          console.error(`Invalid commander damage: Cannot be negative`);
          return action;
        }
        
        break;
      }
    }
  }

  // If we reach here, the action is valid
  return next(action);
};

export default validationMiddleware; 