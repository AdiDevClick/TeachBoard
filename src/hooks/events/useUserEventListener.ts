import { useState, useRef, useEffect } from "react";

const defaultOptions: AddEventListenerOptions = {
  capture: true,
  passive: false,
};

/**
 * Hook to listen to browser events and get the last triggered event
 *
 * @description You can pass an optional callback to execute on each event
 * or just get the last event of the specified type.
 * Callback will always bypass the state update.
 *
 * @param myGlobalEventToListen (Global) Event name to listen for
 * @param myEventFunction Optional callback function to execute on event
 * @param options Event listener options
 * @returns The last triggered event of the specified type
 *
 * @example
 * ```tsx
 * Option1 : Create your own handler
 * useUserEventListener("popstate", (e) => {
 *   console.log("Popstate event detected:", e);
 * });
 *
 * Option2 : Just get the last event
 * const { myEvent } = useUserEventListener("keydown");
 *
 * useEffect(() => {
 *   if (myEvent) {
 *     console.log("Last keydown event:", myEvent);
 *   }
 * }, [myEvent]);
 * ```
 */
export function useUserEventListener<K extends keyof WindowEventMap>(
  myGlobalEventToListen: K = "popstate" as K,
  myEventFunction?: (e: WindowEventMap[K]) => void,
  options = defaultOptions
) {
  const [state, setState] = useState<WindowEventMap[K]>(null!);
  const abortControllerRef = useRef<AbortController>(null!);

  const handler = (e: WindowEventMap[K]) => {
    if (myEventFunction) {
      setState(e);
      return myEventFunction(e);
    }

    setState(e);
    return e;
  };

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    globalThis.addEventListener(myGlobalEventToListen, handler, {
      // globalThis.addEventListener(myGlobalEventToListen, handler as EventListener, {
      signal: abortControllerRef.current.signal,
      ...options,
    });

    return () => {
      setState(null!);
      abortControllerRef.current.abort();
    };
  }, [myGlobalEventToListen, myEventFunction, options]);

  return {
    myEvent: state,
  };
}
