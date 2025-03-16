import { StorageService } from '../../services/storage/StorageService';
import { StorageUtils } from '../../services/storage/StorageUtils';
import { GameState } from '../../types/game';
import { Card } from '../../types/card';

const DB_NAME = 'mtg_commander';

describe('StorageService', () => {
  let storageService: StorageService;

  beforeAll(async () => {
    // Clear any existing databases
    await StorageUtils.clearIndexedDB(DB_NAME);
  });

  beforeEach(async () => {
    // Initialize service and clear storages before each test
    storageService = new StorageService();
    sessionStorage.clear();
  });

  afterEach(async () => {
    // Clean up after each test
    await storageService.clearCards();
    await storageService.closeDB();
  });

  afterAll(async () => {
    // Final cleanup
    await StorageUtils.clearIndexedDB(DB_NAME);
  });

  describe('SessionStorage', () => {
    const mockGameState: GameState = {
      id: '123',
      players: [],
      turn: 1,
      phase: 'MAIN_1',
      activePlayer: '1'
    };

    it('should save game state to session storage', async () => {
      await storageService.saveGameState(mockGameState);
      const retrieved = await storageService.getGameState(mockGameState.id);
      expect(retrieved).toEqual(mockGameState);
    });

    it('should return null for non-existent game state', async () => {
      const retrieved = await storageService.getGameState('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should handle storage quota exceeded error', async () => {
      // Save a game state first to ensure storage is working
      await storageService.saveGameState(mockGameState);
      
      // Then set quota exceeded
      (sessionStorage as any)._setQuotaExceeded(true);
      
      expect.assertions(1); // Ensure exactly one assertion passes
      
      try {
        await storageService.saveGameState({
          ...mockGameState,
          id: '456' // Different ID to force new save
        });
      } catch (error) {
        // The error should be either quota exceeded or storage not available
        expect(
          error.message === 'Storage quota exceeded' ||
          error.message === 'SessionStorage is not available'
        ).toBe(true);
      }
      
      (sessionStorage as any)._setQuotaExceeded(false);
    });

    it('should handle storage not available', async () => {
      (sessionStorage as any)._setAvailable(false);
      await expect(storageService.saveGameState(mockGameState))
        .rejects
        .toThrow('SessionStorage is not available');
      (sessionStorage as any)._setAvailable(true);
    });
  });

  describe('IndexedDB', () => {
    const mockCard: Card = {
      id: 'test-card-1',
      name: 'Test Card',
      types: ['Creature'],
      manaCost: '{1}{G}',
      power: '2',
      toughness: '2'
    };

    it('should save and retrieve card data', async () => {
      await storageService.saveCard(mockCard);
      const retrieved = await storageService.getCard(mockCard.id);
      expect(retrieved).toEqual(mockCard);
    });

    it('should update existing card data', async () => {
      await storageService.saveCard(mockCard);
      const updatedCard = { ...mockCard, name: 'Updated Card' };
      await storageService.saveCard(updatedCard);
      const retrieved = await storageService.getCard(mockCard.id);
      expect(retrieved).toEqual(updatedCard);
    });

    it('should return null for non-existent card', async () => {
      const retrieved = await storageService.getCard('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should handle multiple cards correctly', async () => {
      const mockCards = [
        mockCard,
        {
          id: 'test-card-2',
          name: 'Test Card 2',
          types: ['Instant'],
          manaCost: '{U}'
        }
      ];

      await Promise.all(mockCards.map(card => storageService.saveCard(card)));
      const allCards = await storageService.getAllCards();
      expect(allCards).toHaveLength(2);
      expect(allCards).toEqual(expect.arrayContaining(mockCards));
    });

    it('should clear all cards', async () => {
      await storageService.saveCard(mockCard);
      await storageService.clearCards();
      const allCards = await storageService.getAllCards();
      expect(allCards).toHaveLength(0);
    });
  });

  describe('Storage Stats', () => {
    it('should return storage statistics', async () => {
      const mockGameState: GameState = {
        id: '123',
        players: [],
        turn: 1,
        phase: 'MAIN_1',
        activePlayer: '1'
      };

      await storageService.saveGameState(mockGameState);
      await storageService.saveCard({
        id: 'test-card-1',
        name: 'Test Card',
        types: ['Creature'],
        manaCost: '{1}{G}'
      });

      const stats = await storageService.getStorageStats();
      expect(stats.sessionStorage).toBeGreaterThan(0);
      expect(stats.indexedDB).toBeGreaterThan(0);
    });
  });
}); 