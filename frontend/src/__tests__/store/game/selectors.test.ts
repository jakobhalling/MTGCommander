import { RootState } from '../../../store';
import * as selectors from '../../../store/game/selectors';
import { GameState, PlayerState, ZoneState, CardState, GamePhase, ZoneType } from '../../../types/game/GameState';

// Mock game state for testing
const mockPlayer1: PlayerState = {
  id: 'player1',
  name: 'Player 1',
  life: 40,
  commanderDamage: {
    'commander1': 5,
    'commander2': 3
  },
  zones: {
    hand: {
      id: 'player1-hand',
      type: 'hand',
      cards: ['card1', 'card2'],
      ownerId: 'player1'
    },
    library: {
      id: 'player1-library',
      type: 'library',
      cards: ['card3', 'card4', 'card5'],
      ownerId: 'player1'
    },
    graveyard: {
      id: 'player1-graveyard',
      type: 'graveyard',
      cards: ['card6'],
      ownerId: 'player1'
    },
    exile: {
      id: 'player1-exile',
      type: 'exile',
      cards: [],
      ownerId: 'player1'
    },
    battlefield: {
      id: 'player1-battlefield',
      type: 'battlefield',
      cards: ['card7', 'card8'],
      ownerId: 'player1'
    },
    command: {
      id: 'player1-command',
      type: 'command',
      cards: ['commander1'],
      ownerId: 'player1'
    }
  }
};

const mockPlayer2: PlayerState = {
  id: 'player2',
  name: 'Player 2',
  life: 35,
  commanderDamage: {
    'commander1': 2
  },
  zones: {
    hand: {
      id: 'player2-hand',
      type: 'hand',
      cards: ['card9', 'card10'],
      ownerId: 'player2'
    },
    library: {
      id: 'player2-library',
      type: 'library',
      cards: ['card11', 'card12', 'card13'],
      ownerId: 'player2'
    },
    graveyard: {
      id: 'player2-graveyard',
      type: 'graveyard',
      cards: [],
      ownerId: 'player2'
    },
    exile: {
      id: 'player2-exile',
      type: 'exile',
      cards: ['card14'],
      ownerId: 'player2'
    },
    battlefield: {
      id: 'player2-battlefield',
      type: 'battlefield',
      cards: ['card15', 'commander2'],
      ownerId: 'player2'
    },
    command: {
      id: 'player2-command',
      type: 'command',
      cards: [],
      ownerId: 'player2'
    }
  }
};

// Create mock card objects for testing selectCardById
const mockCards: Record<string, CardState> = {
  card1: {
    id: 'card1',
    name: 'Test Card 1',
    types: ['Creature'],
    currentZone: 'player1-hand',
    ownerId: 'player1',
    isTapped: false,
    counters: {},
    attachments: []
  },
  card7: {
    id: 'card7',
    name: 'Test Card 7',
    types: ['Artifact'],
    currentZone: 'player1-battlefield',
    ownerId: 'player1',
    isTapped: true,
    counters: { 'charge': 3 },
    attachments: []
  },
  commander2: {
    id: 'commander2',
    name: 'Commander 2',
    types: ['Creature', 'Legendary'],
    currentZone: 'player2-battlefield',
    ownerId: 'player2',
    isTapped: false,
    counters: { 'damage': 2 },
    attachments: []
  }
};

// Update the zones to include card objects for selectCardById test
const mockGameStateWithCardObjects: GameState = {
  id: 'game1',
  players: {
    'player1': {
      ...mockPlayer1,
      zones: {
        ...mockPlayer1.zones,
        hand: {
          ...mockPlayer1.zones.hand,
          cards: [mockCards.card1, 'card2'] as any
        },
        battlefield: {
          ...mockPlayer1.zones.battlefield,
          cards: [mockCards.card7, 'card8'] as any
        }
      }
    },
    'player2': {
      ...mockPlayer2,
      zones: {
        ...mockPlayer2.zones,
        battlefield: {
          ...mockPlayer2.zones.battlefield,
          cards: ['card15', mockCards.commander2] as any
        }
      }
    }
  },
  activePlayer: 'player1',
  turnNumber: 3,
  phase: 'main1',
  stack: ['card10'],
  turnOrder: ['player1', 'player2']
};

const mockGameState: GameState = {
  id: 'game1',
  players: {
    'player1': mockPlayer1,
    'player2': mockPlayer2
  },
  activePlayer: 'player1',
  turnNumber: 3,
  phase: 'main1',
  stack: ['card10'],
  turnOrder: ['player1', 'player2']
};

// Mock root state
const mockRootState: RootState = {
  game: {
    currentGame: mockGameState
  }
} as RootState;

// Mock root state with card objects
const mockRootStateWithCardObjects: RootState = {
  game: {
    currentGame: mockGameStateWithCardObjects
  }
} as RootState;

// Mock empty state
const emptyRootState: RootState = {
  game: {
    currentGame: null
  }
} as RootState;

describe('Game Selectors', () => {
  // Basic Selectors
  describe('Basic Selectors', () => {
    test('selectCurrentGame should return the current game state', () => {
      expect(selectors.selectCurrentGame(mockRootState)).toEqual(mockGameState);
      expect(selectors.selectCurrentGame(emptyRootState)).toBeNull();
    });

    test('selectGameId should return the game ID', () => {
      expect(selectors.selectGameId(mockRootState)).toBe('game1');
      expect(selectors.selectGameId(emptyRootState)).toBeNull();
    });

    test('selectActivePlayer should return the active player ID', () => {
      expect(selectors.selectActivePlayer(mockRootState)).toBe('player1');
      expect(selectors.selectActivePlayer(emptyRootState)).toBeNull();
    });

    test('selectCurrentPhase should return the current phase', () => {
      expect(selectors.selectCurrentPhase(mockRootState)).toBe('main1');
      expect(selectors.selectCurrentPhase(emptyRootState)).toBeNull();
    });

    test('selectTurnNumber should return the turn number', () => {
      expect(selectors.selectTurnNumber(mockRootState)).toBe(3);
      expect(selectors.selectTurnNumber(emptyRootState)).toBeNull();
    });
  });

  // Player Selectors
  describe('Player Selectors', () => {
    test('selectPlayers should return all players', () => {
      expect(selectors.selectPlayers(mockRootState)).toEqual({
        'player1': mockPlayer1,
        'player2': mockPlayer2
      });
      expect(selectors.selectPlayers(emptyRootState)).toEqual({});
    });

    test('selectPlayerById should return a specific player', () => {
      expect(selectors.selectPlayerById('player1')(mockRootState)).toEqual(mockPlayer1);
      expect(selectors.selectPlayerById('player2')(mockRootState)).toEqual(mockPlayer2);
      expect(selectors.selectPlayerById('nonexistent')(mockRootState)).toBeNull();
      expect(selectors.selectPlayerById('player1')(emptyRootState)).toBeNull();
    });

    test('selectPlayerLife should return a player\'s life total', () => {
      expect(selectors.selectPlayerLife('player1')(mockRootState)).toBe(40);
      expect(selectors.selectPlayerLife('player2')(mockRootState)).toBe(35);
      expect(selectors.selectPlayerLife('nonexistent')(mockRootState)).toBeNull();
      expect(selectors.selectPlayerLife('player1')(emptyRootState)).toBeNull();
    });

    test('selectPlayerCommanderDamage should return commander damage for a player', () => {
      expect(selectors.selectPlayerCommanderDamage('player1')(mockRootState)).toEqual({
        'commander1': 5,
        'commander2': 3
      });
      expect(selectors.selectPlayerCommanderDamage('player2')(mockRootState)).toEqual({
        'commander1': 2
      });
      expect(selectors.selectPlayerCommanderDamage('nonexistent')(mockRootState)).toEqual({});
      expect(selectors.selectPlayerCommanderDamage('player1')(emptyRootState)).toEqual({});
    });
  });

  // Zone Selectors
  describe('Zone Selectors', () => {
    test('selectAllZones should return all zones from all players', () => {
      const allZones = selectors.selectAllZones(mockRootState);
      expect(allZones.length).toBe(12); // 6 zones per player, 2 players
      expect(allZones).toContainEqual(mockPlayer1.zones.hand);
      expect(allZones).toContainEqual(mockPlayer2.zones.battlefield);
      expect(selectors.selectAllZones(emptyRootState)).toEqual([]);
    });

    test('selectZoneById should return a specific zone', () => {
      expect(selectors.selectZoneById('player1-hand')(mockRootState)).toEqual(mockPlayer1.zones.hand);
      expect(selectors.selectZoneById('player2-battlefield')(mockRootState)).toEqual(mockPlayer2.zones.battlefield);
      expect(selectors.selectZoneById('nonexistent')(mockRootState)).toBeNull();
      expect(selectors.selectZoneById('player1-hand')(emptyRootState)).toBeNull();
    });

    test('selectZonesByType should return all zones of a specific type', () => {
      const handZones = selectors.selectZonesByType('hand')(mockRootState);
      expect(handZones.length).toBe(2);
      expect(handZones).toContainEqual(mockPlayer1.zones.hand);
      expect(handZones).toContainEqual(mockPlayer2.zones.hand);
      
      const battlefieldZones = selectors.selectZonesByType('battlefield')(mockRootState);
      expect(battlefieldZones.length).toBe(2);
      expect(battlefieldZones).toContainEqual(mockPlayer1.zones.battlefield);
      expect(battlefieldZones).toContainEqual(mockPlayer2.zones.battlefield);
      
      expect(selectors.selectZonesByType('hand')(emptyRootState)).toEqual([]);
    });

    test('selectPlayerZones should return all zones for a specific player', () => {
      expect(selectors.selectPlayerZones('player1')(mockRootState)).toEqual(mockPlayer1.zones);
      expect(selectors.selectPlayerZones('player2')(mockRootState)).toEqual(mockPlayer2.zones);
      expect(selectors.selectPlayerZones('nonexistent')(mockRootState)).toBeNull();
      expect(selectors.selectPlayerZones('player1')(emptyRootState)).toBeNull();
    });
  });

  // Card Selectors
  describe('Card Selectors', () => {
    test('selectCardsByZone should return all cards in a specific zone', () => {
      expect(selectors.selectCardsByZone('player1-hand')(mockRootState)).toEqual(['card1', 'card2']);
      expect(selectors.selectCardsByZone('player2-battlefield')(mockRootState)).toEqual(['card15', 'commander2']);
      expect(selectors.selectCardsByZone('nonexistent')(mockRootState)).toEqual([]);
      expect(selectors.selectCardsByZone('player1-hand')(emptyRootState)).toEqual([]);
    });

    test('selectCardById should return a specific card', () => {
      expect(selectors.selectCardById('card1')(mockRootStateWithCardObjects)).toEqual(mockCards.card1);
      expect(selectors.selectCardById('card7')(mockRootStateWithCardObjects)).toEqual(mockCards.card7);
      expect(selectors.selectCardById('commander2')(mockRootStateWithCardObjects)).toEqual(mockCards.commander2);
      expect(selectors.selectCardById('nonexistent')(mockRootStateWithCardObjects)).toBeNull();
      expect(selectors.selectCardById('card1')(emptyRootState)).toBeNull();
    });

    test('selectCardLocation should return the location of a card', () => {
      expect(selectors.selectCardLocation('card1')(mockRootState)).toEqual({
        zoneId: 'player1-hand',
        ownerId: 'player1'
      });
      expect(selectors.selectCardLocation('card15')(mockRootState)).toEqual({
        zoneId: 'player2-battlefield',
        ownerId: 'player2'
      });
      expect(selectors.selectCardLocation('nonexistent')(mockRootState)).toBeNull();
      expect(selectors.selectCardLocation('card1')(emptyRootState)).toBeNull();
    });

    test('selectCardsByOwner should return all cards owned by a player', () => {
      const player1Cards = selectors.selectCardsByOwner('player1')(mockRootState);
      expect(player1Cards.length).toBe(9); // All cards in player1's zones
      expect(player1Cards).toContain('card1');
      expect(player1Cards).toContain('card8');
      expect(player1Cards).toContain('commander1');
      
      const player2Cards = selectors.selectCardsByOwner('player2')(mockRootState);
      expect(player2Cards.length).toBe(8); // All cards in player2's zones
      expect(player2Cards).toContain('card9');
      expect(player2Cards).toContain('card15');
      expect(player2Cards).toContain('commander2');
      
      expect(selectors.selectCardsByOwner('nonexistent')(mockRootState)).toEqual([]);
      expect(selectors.selectCardsByOwner('player1')(emptyRootState)).toEqual([]);
    });
  });

  // Game State Queries
  describe('Game State Queries', () => {
    test('selectIsPlayerTurn should return whether it is a player\'s turn', () => {
      expect(selectors.selectIsPlayerTurn('player1')(mockRootState)).toBe(true);
      expect(selectors.selectIsPlayerTurn('player2')(mockRootState)).toBe(false);
      expect(selectors.selectIsPlayerTurn('nonexistent')(mockRootState)).toBe(false);
      expect(selectors.selectIsPlayerTurn('player1')(emptyRootState)).toBe(false);
    });

    test('selectCanPlayerAct should return whether a player can act', () => {
      expect(selectors.selectCanPlayerAct('player1')(mockRootState)).toBe(true); // Active player in main1 phase
      expect(selectors.selectCanPlayerAct('player2')(mockRootState)).toBe(false); // Not active player
      
      // Create a modified state with untap phase
      const untapPhaseState = {
        ...mockRootState,
        game: {
          currentGame: {
            ...mockGameState,
            phase: 'untap' as GamePhase
          }
        }
      } as RootState;
      
      expect(selectors.selectCanPlayerAct('player1')(untapPhaseState)).toBe(false); // Active player but in untap phase
      expect(selectors.selectCanPlayerAct('player1')(emptyRootState)).toBe(false);
    });

    test('selectGameStatus should return the game status', () => {
      expect(selectors.selectGameStatus(mockRootState)).toBe('in_progress');
      expect(selectors.selectGameStatus(emptyRootState)).toBe('not_started');
    });
  });
}); 