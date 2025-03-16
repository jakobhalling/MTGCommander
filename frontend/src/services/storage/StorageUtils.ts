export class StorageUtils {
  static isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }

  static isIndexedDBAvailable(): boolean {
    try {
      return 'indexedDB' in window;
    } catch (e) {
      return false;
    }
  }

  static getStorageUsage(type: 'localStorage' | 'sessionStorage'): number {
    try {
      const storage = window[type];
      let total = 0;
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          const value = storage.getItem(key);
          if (value) {
            total += key.length + value.length;
          }
        }
      }
      return total;
    } catch (e) {
      return 0;
    }
  }

  static async clearIndexedDB(dbName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
} 