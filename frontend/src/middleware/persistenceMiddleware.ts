import { Middleware } from 'redux';
import { RootState } from '../store';
import { GAME_ACTIONS } from '../store/game/types';

/**
 * Middleware that persists game state to browser storage after state changes
 */
const persistenceMiddleware: Middleware = store => next => action => {
  // Process the action first
  const result = next(action);
  
  // Skip persistence for non-game actions
  if (!action.type || !Object.values(GAME_ACTIONS).includes(action.type)) {
    return result;
  }

  // Get the updated state
  const state = store.getState() as RootState;
  const { currentGame } = state.game;

  // Handle game state persistence
  if (action.type === GAME_ACTIONS.CLEAR_GAME) {
    // Remove game from storage when cleared
    try {
      sessionStorage.removeItem('currentGame');
      console.log('Game state cleared from storage');
    } catch (error) {
      console.error('Failed to clear game state from storage:', error);
    }
  } else if (currentGame) {
    // Save current game state to session storage
    try {
      sessionStorage.setItem('currentGame', JSON.stringify(currentGame));
      console.log('Game state saved to storage');
    } catch (error) {
      console.error('Failed to save game state to storage:', error);
    }
  }

  return result;
};

export default persistenceMiddleware; 