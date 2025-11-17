import type { MutationObserverHook } from "@/hooks/types/use-mutation-observer.types.ts";
import { useCallback, useRef, useState } from "react";

const defaultOptions = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: false,
};

/**
 * Hook that creates and manages a MutationObserver
 *
 * @param callback - HandleObs function called when mutations are observed
 * @param options - MutationObserver's options
 * @returns A ref setter function to attach to the target element
 */
export function useMutationObserver({
  callback = () => {},
  options = defaultOptions,
  onNodeReady,
}: MutationObserverHook) {
  const observerRef = useRef<MutationObserver | null>(null);
  const nodeRef = useRef<HTMLElement | null>(null);

  const [state, setState] = useState({
    observedRef: null! as HTMLElement,
    observer: null! as MutationObserver,
  });

  // Insert the setRef into the DOM
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node || node === nodeRef.current) return;

      if (observerRef.current) observerRef.current.disconnect();

      nodeRef.current = node;
      const obs = new MutationObserver(callback);
      observerRef.current = obs;
      obs.observe(node, options);

      // Update state to trigger re-render so consumer sees node/observer

      setState({ observedRef: node, observer: obs });
      onNodeReady?.(node);
    },
    [callback, options, onNodeReady]
  );

  return {
    setRef,
    ...state,
  };
}
