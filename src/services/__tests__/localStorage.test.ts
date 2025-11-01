import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from '../localStorage';

describe('localStorage service', () => {
  beforeEach(() => {
    // localStorage をクリア
    localStorage.clear();
    // console.error のモックをリセット
    vi.restoreAllMocks();
  });

  describe('saveToLocalStorage', () => {
    it('should save string value to localStorage', () => {
      saveToLocalStorage('test-key', 'test-value');
      expect(localStorage.getItem('test-key')).toBe('"test-value"');
    });

    it('should save object value to localStorage', () => {
      const testObject = { name: 'test', value: 123 };
      saveToLocalStorage('test-key', testObject);
      const stored = localStorage.getItem('test-key');
      expect(JSON.parse(stored!)).toEqual(testObject);
    });

    it('should save array value to localStorage', () => {
      const testArray = [1, 2, 3];
      saveToLocalStorage('test-key', testArray);
      const stored = localStorage.getItem('test-key');
      expect(JSON.parse(stored!)).toEqual(testArray);
    });

    it('should handle save errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // localStorage.setItem をモックしてエラーをスロー
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      saveToLocalStorage('test-key', 'test-value');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'localStorage save error:',
        expect.any(Error)
      );

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('loadFromLocalStorage', () => {
    it('should load string value from localStorage', () => {
      localStorage.setItem('test-key', '"test-value"');
      const result = loadFromLocalStorage<string>('test-key');
      expect(result).toBe('test-value');
    });

    it('should load object value from localStorage', () => {
      const testObject = { name: 'test', value: 123 };
      localStorage.setItem('test-key', JSON.stringify(testObject));
      const result = loadFromLocalStorage<typeof testObject>('test-key');
      expect(result).toEqual(testObject);
    });

    it('should load array value from localStorage', () => {
      const testArray = [1, 2, 3];
      localStorage.setItem('test-key', JSON.stringify(testArray));
      const result = loadFromLocalStorage<number[]>('test-key');
      expect(result).toEqual(testArray);
    });

    it('should return null when key does not exist', () => {
      const result = loadFromLocalStorage<string>('non-existent-key');
      expect(result).toBeNull();
    });

    it('should handle load errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // localStorage.getItem をモックしてエラーをスロー
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const result = loadFromLocalStorage<string>('test-key');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'localStorage load error:',
        expect.any(Error)
      );

      getItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should handle invalid JSON gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      localStorage.setItem('test-key', 'invalid-json{');
      const result = loadFromLocalStorage<string>('test-key');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'localStorage load error:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearLocalStorage', () => {
    it('should clear all localStorage data', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');

      expect(localStorage.length).toBe(3);

      clearLocalStorage();

      expect(localStorage.length).toBe(0);
    });

    it('should handle clear errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // localStorage.clear をモックしてエラーをスロー
      const clearSpy = vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      clearLocalStorage();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'localStorage clear error:',
        expect.any(Error)
      );

      clearSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
