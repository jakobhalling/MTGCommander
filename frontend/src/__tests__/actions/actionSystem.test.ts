import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../../store/game/gameSlice';
import { mockGameState } from '../../mockData';
import { 
  createAction, 
  validateAction, 
  executeAction,
  ActionType,
  ActionValidationResult,
  MoveCardAction,
  TapCardAction
} from '../../actions/actionSystem';
import { GameState } from '../../types/game/GameState';

// Mock the game state to match our test expectations
jest.mock('../../mockData', () => ({
  mockGameState: {
    id: 'game-1',
    players: {
      'player-1': {
        id: 'player-1',
        name: 'Player 1',
        life: 40,
        zones: {
          hand: {
            id: 'hand-1',
            type: 'hand',
            cards: ['card-1', 'card-2'],
            ownerId: 'player-1'
          },
          battlefield: {
            id: 'battlefield-1',
            type: 'battlefield',
            cards: ['card-3'],
            ownerId: 'player-1'
          },
          library: {
            id: 'library-1',
            type: 'library',
            cards: ['card-4', 'card-5'],
            ownerId: 'player-1'
          },
          graveyard: {
            id: 'graveyard-1',
            type: 'graveyard',
            cards: [],
            ownerId: 'player-1'
          },
          exile: {
            id: 'exile-1',
            type: 'exile',
            cards: [],
            ownerId: 'player-1'
          },
          command: {
            id: 'command-1',
            type: 'command',
            cards: ['card-6'],
            ownerId: 'player-1'
          }
        },
        commanderDamage: {}
      }
    },
    activePlayer: 'player-1',
    turnNumber: 1,
    phase: 'main1',
    stack: [],
    turnOrder: ['player-1']
  }
}));

// Type for our store state
interface RootState {
  game: {
    currentGame: GameState;
  };
}

describe('Action System', () => {
  let store: ReturnType<typeof configureStore>;
  
  beforeEach(() => {
    // Cast the entire store configuration to any to avoid type errors
    // This is acceptable in a test environment
    store = configureStore({
      reducer: {
        game: gameReducer
      },
      preloadedState: {
        game: {
          currentGame: mockGameState as unknown as GameState
        }
      }
    } as any);
  });

  describe('Action Creator Interfaces', () => {
    it('should create a move card action', () => {
      const action = createAction<MoveCardAction>({
        type: ActionType.MOVE_CARD,
        cardId: 'card-1',
        sourceZoneId: 'hand-1',
        targetZoneId: 'battlefield-1',
        playerId: 'player-1'
      });

      expect(action).toEqual({
        type: ActionType.MOVE_CARD,
        cardId: 'card-1',
        sourceZoneId: 'hand-1',
        targetZoneId: 'battlefield-1',
        playerId: 'player-1'
      });
    });

    it('should create a tap card action', () => {
      const action = createAction<TapCardAction>({
        type: ActionType.TAP_CARD,
        cardId: 'card-1',
        playerId: 'player-1'
      });

      expect(action).toEqual({
        type: ActionType.TAP_CARD,
        cardId: 'card-1',
        playerId: 'player-1'
      });
    });
  });

  describe('Action Validation', () => {
    it('should validate a valid move card action', () => {
      const action: MoveCardAction = {
        type: ActionType.MOVE_CARD,
        cardId: 'card-1',
        sourceZoneId: 'hand-1',
        targetZoneId: 'battlefield-1',
        playerId: 'player-1'
      };

      const state = store.getState() as RootState;
      const result = validateAction(action, state.game.currentGame);
      expect(result.isValid).toBe(true);
    });

    it('should invalidate a move card action with invalid card ID', () => {
      const action: MoveCardAction = {
        type: ActionType.MOVE_CARD,
        cardId: 'non-existent-card',
        sourceZoneId: 'hand-1',
        targetZoneId: 'battlefield-1',
        playerId: 'player-1'
      };

      const state = store.getState() as RootState;
      const result = validateAction(action, state.game.currentGame);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Card not found in source zone');
    });
  });

  describe('Action Execution Pipeline', () => {
    it('should execute a valid move card action', () => {
      const action: MoveCardAction = {
        type: ActionType.MOVE_CARD,
        cardId: 'card-1',
        sourceZoneId: 'hand-1',
        targetZoneId: 'battlefield-1',
        playerId: 'player-1'
      };

      const result = executeAction(action, store);
      expect(result.success).toBe(true);
      
      // Check that the card was moved in the state
      const state = store.getState() as RootState;
      const sourceZone = Object.values(state.game.currentGame.players)
        .flatMap(player => Object.values(player.zones))
        .find(zone => zone.id === 'hand-1');
      
      const targetZone = Object.values(state.game.currentGame.players)
        .flatMap(player => Object.values(player.zones))
        .find(zone => zone.id === 'battlefield-1');
      
      expect(sourceZone?.cards).not.toContain('card-1');
      expect(targetZone?.cards).toContain('card-1');
    });

    it('should not execute an invalid action', () => {
      const action: MoveCardAction = {
        type: ActionType.MOVE_CARD,
        cardId: 'non-existent-card',
        sourceZoneId: 'hand-1',
        targetZoneId: 'battlefield-1',
        playerId: 'player-1'
      };

      const initialState = JSON.stringify(store.getState());
      const result = executeAction(action, store);
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Card not found in source zone');
      
      // State should not have changed
      expect(JSON.stringify(store.getState())).toBe(initialState);
    });
  });
}); 