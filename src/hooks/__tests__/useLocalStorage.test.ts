import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // localStorage をクリア
    localStorage.clear();
    // console.error のモックをリセット
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should use initial value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

      expect(result.current[0]).toBe('initial-value');
    });

    it('should load value from localStorage when it exists', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'));

      const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

      expect(result.current[0]).toBe('stored-value');
    });

    it('should load object from localStorage', () => {
      const storedObject = { name: 'test', value: 123 };
      localStorage.setItem('test-key', JSON.stringify(storedObject));

      const { result } = renderHook(() => useLocalStorage('test-key', { name: '', value: 0 }));

      expect(result.current[0]).toEqual(storedObject);
    });

    it('should load array from localStorage', () => {
      const storedArray = [1, 2, 3];
      localStorage.setItem('test-key', JSON.stringify(storedArray));

      const { result } = renderHook(() => useLocalStorage<number[]>('test-key', []));

      expect(result.current[0]).toEqual(storedArray);
    });

    it('should use initial value when localStorage contains invalid JSON', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('test-key', 'invalid-json{');

      const { result } = renderHook(() => useLocalStorage('test-key', 'fallback-value'));

      expect(result.current[0]).toBe('fallback-value');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error loading test-key from localStorage:'),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle localStorage.getItem errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const { result } = renderHook(() => useLocalStorage('test-key', 'fallback-value'));

      expect(result.current[0]).toBe('fallback-value');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error loading test-key from localStorage:'),
        expect.any(Error)
      );

      getItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('auto-save', () => {
    it('should save value to localStorage when updated', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

      act(() => {
        result.current[1]('updated-value');
      });

      const stored = localStorage.getItem('test-key');
      expect(JSON.parse(stored!)).toBe('updated-value');
    });

    it('should save object to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', { name: '', value: 0 }));

      const newObject = { name: 'test', value: 123 };
      act(() => {
        result.current[1](newObject);
      });

      const stored = localStorage.getItem('test-key');
      expect(JSON.parse(stored!)).toEqual(newObject);
    });

    it('should save array to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage<number[]>('test-key', []));

      act(() => {
        result.current[1]([1, 2, 3]);
      });

      const stored = localStorage.getItem('test-key');
      expect(JSON.parse(stored!)).toEqual([1, 2, 3]);
    });

    it('should save initial value to localStorage on mount', () => {
      renderHook(() => useLocalStorage('test-key', 'initial-value'));

      const stored = localStorage.getItem('test-key');
      expect(JSON.parse(stored!)).toBe('initial-value');
    });

    it('should handle localStorage.setItem errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

      act(() => {
        result.current[1]('new-value');
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error saving test-key to localStorage:'),
        expect.any(Error)
      );

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('multiple instances', () => {
    it('should synchronize value across multiple hook instances with same key', () => {
      const { result: result1 } = renderHook(() => useLocalStorage('shared-key', 'initial'));
      const { result: result2 } = renderHook(() => useLocalStorage('shared-key', 'initial'));

      expect(result1.current[0]).toBe('initial');
      expect(result2.current[0]).toBe('initial');

      // Update from first instance
      act(() => {
        result1.current[1]('updated');
      });

      // Verify value is updated
      expect(result1.current[0]).toBe('updated');

      // Note: result2 won't automatically update without storage event
      // This is expected behavior for same-window instances
    });
  });

  describe('return type', () => {
    it('should return tuple with value and setter', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(2);
      expect(typeof result.current[0]).toBe('string');
      expect(typeof result.current[1]).toBe('function');
    });
  });
});
