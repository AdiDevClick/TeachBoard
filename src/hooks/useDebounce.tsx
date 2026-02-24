import { useCallback, useRef } from "react";

type useDebounce = (func: () => void, delay: number) => () => void;

/**
 * Custom hook to debounce a function, preventing it from being called too frequently.
 *
 * @param callback - The function to debounce.
 * @template T - The type of the callback function.
 * @param delay - The debounce delay in milliseconds.
 *
 * @example
 * const debouncedSearch = useDebounce((query) => {
 *   // Perform search with the query
 * }, 300);
 *
 * // Usage in an input change handler
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export default function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timerRef = useRef<number | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      // Cancel any existing timer to reset the debounce period
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // New timer to execute
      timerRef.current = setTimeout(() => {
        callback(...args);
        timerRef.current = null;
      }, delay);
    },
    [callback, delay],
  );
}
