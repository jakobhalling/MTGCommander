// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// Polyfill structuredClone for fake-indexeddb
if (typeof structuredClone !== 'function') {
  (global as any).structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

// Mock window.sessionStorage and localStorage
class MockStorage implements Storage {
  private store: { [key: string]: string } = {};
  private quotaExceeded = false;
  private available = true;

  clear() {
    this.store = {};
    this.quotaExceeded = false;
  }

  getItem(key: string): string | null {
    if (!this.available) {throw new Error('Storage not available');}
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    if (!this.available) {throw new Error('Storage not available');}
    if (this.quotaExceeded) {
      const error = new Error('Storage quota exceeded');
      error.name = 'QuotaExceededError';
      throw error;
    }
    this.store[key] = value;
  }

  removeItem(key: string) {
    if (!this.available) {throw new Error('Storage not available');}
    delete this.store[key];
  }

  get length(): number {
    if (!this.available) {throw new Error('Storage not available');}
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    if (!this.available) {throw new Error('Storage not available');}
    return Object.keys(this.store)[index] || null;
  }

  // Test helper methods
  _setQuotaExceeded(exceeded: boolean) {
    this.quotaExceeded = exceeded;
  }

  _setAvailable(available: boolean) {
    this.available = available;
  }
}

const sessionStorageMock = new MockStorage();
const localStorageMock = new MockStorage();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Reset all mocks before each test
beforeEach(() => {
  sessionStorageMock.clear();
  localStorageMock.clear();
  sessionStorageMock._setAvailable(true);
  localStorageMock._setAvailable(true);
}); 