import type { Target } from "inspector/promises";
import type { RenderHookResult } from "vitest-browser-react";

type HookProxy<R> = Omit<RenderHookResult<R, unknown>, "result"> & R;

/**
 * A proxy to access the latest hook results directly.
 *
 * @param hook The RenderHookResult object from renderHook
 * @returns A proxy object that provides direct access to the latest hook results
 */
function getHookResults<T extends object>(
  hook: RenderHookResult<T, unknown>
): HookProxy<T> {
  if (!hook) throw new Error("Hook not initialized");

  const handler = {
    get(target: Target, prop: PropertyKey) {
      // When someone accesses `proxy.result`, return the original result (with `.current`)
      if (prop === "result") return target.result;

      const current = target?.result?.current;
      const val = current ? current[prop] : undefined;

      // If the property is a function, return a wrapper that always calls the latest
      // function from result.current
      if (typeof val === "function") {
        return (...args: Parameters<typeof val>) =>
          target.result.current[prop](...args);
      }

      // If it's a value, return the latest value, else fallback to target
      if (val !== undefined) return val;
      return target[prop];
    },
  };

  const proxy = new Proxy(hook, handler);
  return proxy;
}

export default getHookResults;
