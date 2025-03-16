import { GameState, PlayerState, ZoneState, CardState } from '../../../types/game/GameState';
import { validateGameState, validatePlayerState, validateZoneState, validateCardState } from '../../../types/game/StateValidation';

describe('State Validation', () => {
  describe('validateCardState', () => {
    it('should validate a valid card state', () => {
      const card: CardState = {
        id: 'card-1',
        name: 'Sol Ring',
        types: ['Artifact'],
        currentZone: 'hand-1',
        ownerId: 'player-1',
        isTapped: false,
        counters: {},
        attachments: []
      };

      expect(() => validateCardState(card)).not.toThrow();
    });

    it('should throw on invalid card state', () => {
      const invalidCard = {
        id: '',  // Empty ID
        name: 'Sol Ring',
        types: ['Artifact'],
        currentZone: 'hand-1',
        ownerId: 'player-1',
        isTapped: false,
        counters: {},
        attachments: []
      };

      expect(() => validateCardState(invalidCard as CardState)).toThrow();
    });
  });

  describe('validateZoneState', () => {
    it('should validate a valid zone state', () => {
      const zone: ZoneState = {
        id: 'hand-1',
        type: 'hand',
        cards: ['card-1', 'card-2'],
        ownerId: 'player-1'
      };

      expect(() => validateZoneState(zone)).not.toThrow();
    });

    it('should throw on invalid zone type', () => {
      const invalidZone = {
        id: 'hand-1',
        type: 'invalid-zone' as any,
        cards: [],
        ownerId: 'player-1'
      };

      expect(() => validateZoneState(invalidZone as ZoneState)).toThrow();
    });
  });

  describe('validatePlayerState', () => {
    it('should validate a valid player state', () => {
      const player: PlayerState = {
        id: 'player-1',
        name: 'Player 1',
        life: 40,
        zones: {
          hand: { id: 'hand-1', type: 'hand', cards: [], ownerId: 'player-1' },
          library: { id: 'library-1', type: 'library', cards: [], ownerId: 'player-1' },
          graveyard: { id: 'graveyard-1', type: 'graveyard', cards: [], ownerId: 'player-1' },
          exile: { id: 'exile-1', type: 'exile', cards: [], ownerId: 'player-1' },
          battlefield: { id: 'battlefield-1', type: 'battlefield', cards: [], ownerId: 'player-1' },
          command: { id: 'command-1', type: 'command', cards: [], ownerId: 'player-1' }
        },
        commanderDamage: {}
      };

      expect(() => validatePlayerState(player)).not.toThrow();
    });

    it('should throw on missing required zones', () => {
      const invalidPlayer = {
        id: 'player-1',
        name: 'Player 1',
        life: 40,
        zones: {
          hand: { id: 'hand-1', type: 'hand', cards: [], ownerId: 'player-1' }
          // Missing other required zones
        },
        commanderDamage: {}
      };

      expect(() => validatePlayerState(invalidPlayer as unknown as PlayerState)).toThrow();
    });
  });

  describe('validateGameState', () => {
    it('should validate a valid game state', () => {
      const game: GameState = {
        id: 'game-1',
        players: {
          'player-1': {
            id: 'player-1',
            name: 'Player 1',
            life: 40,
            zones: {
              hand: { id: 'hand-1', type: 'hand', cards: [], ownerId: 'player-1' },
              library: { id: 'library-1', type: 'library', cards: [], ownerId: 'player-1' },
              graveyard: { id: 'graveyard-1', type: 'graveyard', cards: [], ownerId: 'player-1' },
              exile: { id: 'exile-1', type: 'exile', cards: [], ownerId: 'player-1' },
              battlefield: { id: 'battlefield-1', type: 'battlefield', cards: [], ownerId: 'player-1' },
              command: { id: 'command-1', type: 'command', cards: [], ownerId: 'player-1' }
            },
            commanderDamage: {}
          }
        },
        activePlayer: 'player-1',
        turnNumber: 1,
        phase: 'main1',
        stack: [],
        turnOrder: ['player-1']
      };

      expect(() => validateGameState(game)).not.toThrow();
    });

    it('should throw on invalid active player', () => {
      const game: GameState = {
        id: 'game-1',
        players: {},
        activePlayer: 'non-existent-player',
        turnNumber: 1,
        phase: 'main1',
        stack: [],
        turnOrder: []
      };

      expect(() => validateGameState(game)).toThrow();
    });
  });
}); 