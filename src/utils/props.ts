/**
 * Utilities to sanitize props and avoid passing custom HOC props to DOM elements.
 */
const EXCLUDED_KEYS = new Set([
  // HOC & mutation observer keys
  "setRef",
  "controllerRef",
  "controllerMeta",
  "observedRefs",
  "listMeta",
  "task",
  "apiEndpoint",
  // lower-case accidental props
  "setref",
  "controllerref",
  "controllermeta",
  "observedrefs",
  "listmeta",
]);

export function sanitizeDOMProps<T extends Record<string, unknown>>(
  props: T | undefined,
  extraKeysToExclude: string[] = []
): Partial<T> {
  if (!props) return {};
  const excluded = new Set(EXCLUDED_KEYS);
  for (const key of extraKeysToExclude) excluded.add(key);

  const sanitized: Partial<T> = {};
  for (const [k, v] of Object.entries(props) as [string, unknown][]) {
    if (excluded.has(k)) continue;
    (sanitized as Record<string, unknown>)[k] = v as unknown;
  }
  return sanitized;
}

export default sanitizeDOMProps;
