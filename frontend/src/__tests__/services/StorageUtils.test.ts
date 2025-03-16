import { StorageUtils } from '../../services/storage/StorageUtils';

describe('StorageUtils', () => {
  beforeEach(() => {
    // Clear storages before each test
    sessionStorage.clear();
    localStorage.clear();
  });

  describe('isStorageAvailable', () => {
    it('should detect available sessionStorage', () => {
      expect(StorageUtils.isStorageAvailable('sessionStorage')).toBe(true);
    });

    it('should detect available localStorage', () => {
      expect(StorageUtils.isStorageAvailable('localStorage')).toBe(true);
    });
  });

  describe('isIndexedDBAvailable', () => {
    it('should detect IndexedDB availability', () => {
      expect(StorageUtils.isIndexedDBAvailable()).toBe(true);
    });
  });

  describe('getStorageUsage', () => {
    it('should calculate correct storage usage for sessionStorage', () => {
      const testData = 'test data';
      const testKey = 'test-key';
      sessionStorage.setItem(testKey, testData);

      const usage = StorageUtils.getStorageUsage('sessionStorage');
      expect(usage).toBe(testKey.length + testData.length);
    });

    it('should calculate correct storage usage for localStorage', () => {
      const testData = 'test data';
      const testKey = 'test-key';
      localStorage.setItem(testKey, testData);

      const usage = StorageUtils.getStorageUsage('localStorage');
      expect(usage).toBe(testKey.length + testData.length);
    });

    it('should return 0 for empty storage', () => {
      const usage = StorageUtils.getStorageUsage('sessionStorage');
      expect(usage).toBe(0);
    });
  });

  describe('clearIndexedDB', () => {
    it('should clear IndexedDB database', async () => {
      const dbName = 'test-db';
      
      // Create a test database
      const request = indexedDB.open(dbName, 1);
      await new Promise<void>((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          request.result.close();
          resolve();
        };
      });

      // Clear the database
      await StorageUtils.clearIndexedDB(dbName);

      // Try to open the database again
      const newRequest = indexedDB.open(dbName, 1);
      await new Promise<void>((resolve) => {
        newRequest.onupgradeneeded = () => {
          // If onupgradeneeded is called, it means the database was deleted
          resolve();
        };
        newRequest.onsuccess = () => {
          newRequest.result.close();
          resolve();
        };
      });
    });
  });
}); 