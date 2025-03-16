import { GameState } from '../../types/game';
import { Card } from '../../types/card';
import { StorageUtils } from './StorageUtils';

const DB_NAME = 'mtg_commander';
const DB_VERSION = 1;
const CARD_STORE = 'cards';
const OPERATION_TIMEOUT = 5000; // 5 seconds timeout for operations

export class StorageService {
  private db: IDBDatabase | null = null;
  private dbInitPromise: Promise<void> | null = null;

  constructor() {
    if (!StorageUtils.isStorageAvailable('sessionStorage')) {
      console.warn('SessionStorage is not available. Game state persistence will be limited.');
    }
    if (!StorageUtils.isIndexedDBAvailable()) {
      console.warn('IndexedDB is not available. Card data persistence will be limited.');
    }
  }

  private async initDB(): Promise<void> {
    if (this.dbInitPromise) {
      return this.dbInitPromise;
    }

    if (!StorageUtils.isIndexedDBAvailable()) {
      throw new Error('IndexedDB is not available in this browser');
    }

    this.dbInitPromise = Promise.race([
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
          this.dbInitPromise = null;
          reject(request.error);
        };

        request.onsuccess = () => {
          if (this.db) {
            this.db.close();
          }
          this.db = request.result;
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(CARD_STORE)) {
            db.createObjectStore(CARD_STORE, { keyPath: 'id' });
          }
        };
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database initialization timeout')), OPERATION_TIMEOUT)
      )
    ]);

    return this.dbInitPromise;
  }

  async closeDB(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.dbInitPromise = null;
  }

  // SessionStorage methods for game state
  async saveGameState(state: GameState): Promise<void> {
    try {
      if (!StorageUtils.isStorageAvailable('sessionStorage')) {
        throw new Error('SessionStorage is not available');
      }
      sessionStorage.setItem(`game_${state.id}`, JSON.stringify(state));
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          throw new Error('Storage quota exceeded');
        }
      }
      throw error;
    }
  }

  async getGameState(gameId: string): Promise<GameState | null> {
    if (!StorageUtils.isStorageAvailable('sessionStorage')) {
      throw new Error('SessionStorage is not available');
    }

    try {
      const state = sessionStorage.getItem(`game_${gameId}`);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('Error retrieving game state:', error);
      return null;
    }
  }

  // IndexedDB methods for card data
  private async ensureDBConnection(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  private async withTimeout<T>(promise: Promise<T>, operation: string): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`${operation} timeout`)), OPERATION_TIMEOUT)
      )
    ]);
  }

  async saveCard(card: Card): Promise<void> {
    await this.ensureDBConnection();
    if (!this.db) throw new Error('Database not initialized');

    return this.withTimeout(
      new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([CARD_STORE], 'readwrite');
        const store = transaction.objectStore(CARD_STORE);
        store.put(card);

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      }),
      'Save card'
    );
  }

  async getCard(cardId: string): Promise<Card | null> {
    await this.ensureDBConnection();
    if (!this.db) throw new Error('Database not initialized');

    return this.withTimeout(
      new Promise<Card | null>((resolve, reject) => {
        const transaction = this.db!.transaction([CARD_STORE], 'readonly');
        const store = transaction.objectStore(CARD_STORE);
        const request = store.get(cardId);

        transaction.oncomplete = () => resolve(request.result || null);
        transaction.onerror = () => reject(transaction.error);
      }),
      'Get card'
    );
  }

  async getAllCards(): Promise<Card[]> {
    await this.ensureDBConnection();
    if (!this.db) throw new Error('Database not initialized');

    return this.withTimeout(
      new Promise<Card[]>((resolve, reject) => {
        const transaction = this.db!.transaction([CARD_STORE], 'readonly');
        const store = transaction.objectStore(CARD_STORE);
        const request = store.getAll();

        transaction.oncomplete = () => resolve(request.result);
        transaction.onerror = () => reject(transaction.error);
      }),
      'Get all cards'
    );
  }

  async clearCards(): Promise<void> {
    await this.ensureDBConnection();
    if (!this.db) throw new Error('Database not initialized');

    return this.withTimeout(
      new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([CARD_STORE], 'readwrite');
        const store = transaction.objectStore(CARD_STORE);
        store.clear();

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      }),
      'Clear cards'
    );
  }

  async getStorageStats(): Promise<{ sessionStorage: number; indexedDB: number }> {
    const sessionStorageSize = StorageUtils.getStorageUsage('sessionStorage');
    let indexedDBSize = 0;

    if (this.db) {
      try {
        indexedDBSize = await this.withTimeout(
          StorageUtils.estimateIndexedDBSize(this.db, CARD_STORE),
          'Get storage stats'
        );
      } catch (error) {
        console.error('Error estimating IndexedDB size:', error);
      }
    }

    return {
      sessionStorage: sessionStorageSize,
      indexedDB: indexedDBSize
    };
  }
} 