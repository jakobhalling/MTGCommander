import { Card } from '../../types/card/Card';
import { GameState } from '../../types/game/GameState';

import { StorageUtils } from './StorageUtils';

const DB_NAME = 'mtg_commander';
const DB_VERSION = 1;
const CARD_STORE = 'cards';

export class StorageService {
  private db: IDBDatabase | null = null;
  private dbInitPromise: Promise<void> | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    if (!this.dbInitPromise) {
      this.dbInitPromise = new Promise((resolve, reject) => {
        if (!StorageUtils.isIndexedDBAvailable()) {
          reject(new Error('IndexedDB is not available'));
          return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(CARD_STORE)) {
            db.createObjectStore(CARD_STORE, { keyPath: 'id' });
          }
        };
      });
    }
    return this.dbInitPromise;
  }

  async closeDB(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.dbInitPromise = null;
    }
  }

  async saveGameState(state: GameState): Promise<void> {
    try {
      if (!StorageUtils.isStorageAvailable('sessionStorage')) {
        throw new Error('Storage quota exceeded | SessionStorage is not available');
      }
      sessionStorage.setItem(`game_${state.id}`, JSON.stringify(state));
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          throw new Error('Storage quota exceeded | SessionStorage is not available');
        }
      }
      throw error;
    }
  }

  async getGameState(gameId: string): Promise<GameState | null> {
    if (!StorageUtils.isStorageAvailable('sessionStorage')) {
      throw new Error('SessionStorage is not available');
    }

    const data = sessionStorage.getItem(`game_${gameId}`);
    return data ? JSON.parse(data) : null;
  }

  private async ensureDBConnection(): Promise<void> {
    if (!this.db) {
      await this.initDB();
      if (!this.db) {
        throw new Error('Failed to initialize database');
      }
    }
  }

  async saveCard(card: Card): Promise<void> {
    await this.ensureDBConnection();
    const db = this.db;
    if (!db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CARD_STORE], 'readwrite');
      const store = transaction.objectStore(CARD_STORE);
      const request = store.put(card);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getCard(cardId: string): Promise<Card | null> {
    await this.ensureDBConnection();
    const db = this.db;
    if (!db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CARD_STORE], 'readonly');
      const store = transaction.objectStore(CARD_STORE);
      const request = store.get(cardId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getAllCards(): Promise<Card[]> {
    await this.ensureDBConnection();
    const db = this.db;
    if (!db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CARD_STORE], 'readonly');
      const store = transaction.objectStore(CARD_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async clearCards(): Promise<void> {
    await this.ensureDBConnection();
    const db = this.db;
    if (!db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CARD_STORE], 'readwrite');
      const store = transaction.objectStore(CARD_STORE);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getStorageStats(): Promise<{ sessionStorage: number; indexedDB: number }> {
    const sessionStorageSize = StorageUtils.getStorageUsage('sessionStorage');
    let indexedDBSize = 0;

    if (this.db) {
      const cards = await this.getAllCards();
      indexedDBSize = JSON.stringify(cards).length;
    }

    return {
      sessionStorage: sessionStorageSize,
      indexedDB: indexedDBSize
    };
  }
} 