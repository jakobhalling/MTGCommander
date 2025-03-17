import persistenceMiddleware from '../../middleware/persistenceMiddleware';
import { GAME_ACTIONS } from '../../store/game/types';

describe('Persistence Middleware', () => {
  let store: any;
  let next: jest.Mock;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let originalSessionStorage: Storage;
  
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
        zones: {}
      }
    }
  };
  
  beforeEach(() => {
    // Save original sessionStorage
    originalSessionStorage = window.sessionStorage;
    
    // Create mock sessionStorage
    const mockSessionStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    };
    
    // Replace sessionStorage with mock
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });
    
    store = {
      getState: jest.fn(() => ({
        game: {
          currentGame: mockGameState
        }
      }))
    };
    
    next = jest.fn(action => action);
    
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });
  
  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    
    // Restore original sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true
    });
  });
  
  it('should pass the action to the next middleware', () => {
    const action = { type: GAME_ACTIONS.SET_PHASE, payload: { phase: 'combat' } };
    const middleware = persistenceMiddleware(store)(next);
    const result = middleware(action);
    
    expect(next).toHaveBeenCalledWith(action);
    expect(result).toEqual(action);
  });
  
  it('should save game state to sessionStorage after game actions', () => {
    const action = { type: GAME_ACTIONS.UPDATE_LIFE_TOTAL, payload: { playerId: 'player-1', delta: -5 } };
    const middleware = persistenceMiddleware(store)(next);
    middleware(action);
    
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      'currentGame',
      JSON.stringify(mockGameState)
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('Game state saved to storage');
  });
  
  it('should remove game state from sessionStorage on game clear', () => {
    const action = { type: GAME_ACTIONS.CLEAR_GAME };
    const middleware = persistenceMiddleware(store)(next);
    middleware(action);
    
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('currentGame');
    expect(consoleLogSpy).toHaveBeenCalledWith('Game state cleared from storage');
  });
  
  it('should not persist state for non-game actions', () => {
    const action = { type: 'NON_GAME_ACTION' };
    const middleware = persistenceMiddleware(store)(next);
    middleware(action);
    
    expect(window.sessionStorage.setItem).not.toHaveBeenCalled();
    expect(window.sessionStorage.removeItem).not.toHaveBeenCalled();
  });
  
  it('should handle storage errors gracefully', () => {
    // Simulate a storage error
    (window.sessionStorage.setItem as jest.Mock).mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    const action = { type: GAME_ACTIONS.SET_PHASE, payload: { phase: 'combat' } };
    const middleware = persistenceMiddleware(store)(next);
    middleware(action);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to save game state to storage:',
      expect.any(Error)
    );
    expect(next).toHaveBeenCalledWith(action);
  });
}); 