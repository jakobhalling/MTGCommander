import validationMiddleware from '../../middleware/validationMiddleware';
import { GAME_ACTIONS } from '../../store/game/types';

describe('Validation Middleware', () => {
  let store: any;
  let next: jest.Mock;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  
  beforeEach(() => {
    // Mock game state
    const mockGameState = {
      id: 'game-1',
      phase: 'main1',
      activePlayer: 'player-1',
      turnNumber: 1,
      players: {
        'player-1': {
          id: 'player-1',
          name: 'Player 1',
          life: 40,
          commanderDamage: {},
          zones: {
            'hand-1': {
              id: 'hand-1',
              type: 'hand',
              ownerId: 'player-1',
              cards: ['card-1', 'card-2']
            },
            'battlefield-1': {
              id: 'battlefield-1',
              type: 'battlefield',
              ownerId: 'player-1',
              cards: ['card-3']
            }
          }
        },
        'player-2': {
          id: 'player-2',
          name: 'Player 2',
          life: 40,
          commanderDamage: {},
          zones: {
            'hand-2': {
              id: 'hand-2',
              type: 'hand',
              ownerId: 'player-2',
              cards: ['card-4']
            },
            'battlefield-2': {
              id: 'battlefield-2',
              type: 'battlefield',
              ownerId: 'player-2',
              cards: []
            }
          }
        }
      }
    };
    
    store = {
      getState: jest.fn(() => ({
        game: {
          currentGame: mockGameState
        }
      }))
    };
    
    next = jest.fn(action => action);
    
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });
  
  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
  
  it('should pass non-game actions through without validation', () => {
    const action = { type: 'NON_GAME_ACTION', payload: {} };
    const middleware = validationMiddleware(store)(next);
    middleware(action);
    
    expect(next).toHaveBeenCalledWith(action);
  });
  
  it('should validate card movement actions', () => {
    // Valid card movement
    const validAction = {
      type: GAME_ACTIONS.MOVE_CARD,
      payload: {
        cardId: 'card-1',
        fromZoneId: 'hand-1',
        toZoneId: 'battlefield-1'
      }
    };
    
    const middleware = validationMiddleware(store)(next);
    middleware(validAction);
    
    expect(next).toHaveBeenCalledWith(validAction);
    
    // Invalid card movement - card not in source zone
    const invalidCardAction = {
      type: GAME_ACTIONS.MOVE_CARD,
      payload: {
        cardId: 'non-existent-card',
        fromZoneId: 'hand-1',
        toZoneId: 'battlefield-1'
      }
    };
    
    middleware(invalidCardAction);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid card movement: Card non-existent-card not found')
    );
    expect(next).not.toHaveBeenCalledWith(invalidCardAction);
    
    // Invalid card movement - destination zone doesn't exist
    const invalidZoneAction = {
      type: GAME_ACTIONS.MOVE_CARD,
      payload: {
        cardId: 'card-1',
        fromZoneId: 'hand-1',
        toZoneId: 'non-existent-zone'
      }
    };
    
    middleware(invalidZoneAction);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid card movement: Destination zone non-existent-zone not found')
    );
    expect(next).not.toHaveBeenCalledWith(invalidZoneAction);
  });
  
  it('should validate life total updates', () => {
    // Valid life total update
    const validAction = {
      type: GAME_ACTIONS.UPDATE_LIFE_TOTAL,
      payload: {
        playerId: 'player-1',
        delta: -5
      }
    };
    
    const middleware = validationMiddleware(store)(next);
    middleware(validAction);
    
    expect(next).toHaveBeenCalledWith(validAction);
    
    // Invalid player
    const invalidPlayerAction = {
      type: GAME_ACTIONS.UPDATE_LIFE_TOTAL,
      payload: {
        playerId: 'non-existent-player',
        delta: -5
      }
    };
    
    middleware(invalidPlayerAction);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid life total update: Player non-existent-player not found')
    );
    expect(next).not.toHaveBeenCalledWith(invalidPlayerAction);
    
    // Life total going negative
    const negativeLifeAction = {
      type: GAME_ACTIONS.UPDATE_LIFE_TOTAL,
      payload: {
        playerId: 'player-1',
        delta: -50
      }
    };
    
    middleware(negativeLifeAction);
    
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Life total would go negative for player player-1')
    );
    expect(next).toHaveBeenCalledWith(negativeLifeAction);
  });
  
  it('should validate commander damage updates', () => {
    // Valid commander damage update
    const validAction = {
      type: GAME_ACTIONS.UPDATE_COMMANDER_DAMAGE,
      payload: {
        playerId: 'player-1',
        commanderId: 'commander-1',
        damage: 3
      }
    };
    
    const middleware = validationMiddleware(store)(next);
    middleware(validAction);
    
    expect(next).toHaveBeenCalledWith(validAction);
    
    // Invalid player
    const invalidPlayerAction = {
      type: GAME_ACTIONS.UPDATE_COMMANDER_DAMAGE,
      payload: {
        playerId: 'non-existent-player',
        commanderId: 'commander-1',
        damage: 3
      }
    };
    
    middleware(invalidPlayerAction);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid commander damage update: Player non-existent-player not found')
    );
    expect(next).not.toHaveBeenCalledWith(invalidPlayerAction);
    
    // Negative damage
    const negativeDamageAction = {
      type: GAME_ACTIONS.UPDATE_COMMANDER_DAMAGE,
      payload: {
        playerId: 'player-1',
        commanderId: 'commander-1',
        damage: -3
      }
    };
    
    middleware(negativeDamageAction);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid commander damage: Cannot be negative')
    );
    expect(next).not.toHaveBeenCalledWith(negativeDamageAction);
  });
}); 