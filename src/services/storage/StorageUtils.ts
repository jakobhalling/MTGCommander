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

  static async clearIndexedDB(dbName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  static getStorageUsage(type: 'localStorage' | 'sessionStorage'): number {
    try {
      const storage = window[type];
      let totalSize = 0;
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          const value = storage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }
      return totalSize;
    } catch (e) {
      return 0;
    }
  }

  static async estimateIndexedDBSize(db: IDBDatabase, storeName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const data = request.result;
        const size = new Blob([JSON.stringify(data)]).size;
        resolve(size);
      };
    });
  }
} 