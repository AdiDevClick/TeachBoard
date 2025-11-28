import { DEV_MODE } from "@/configs/app.config.ts";
import type { MutationObserverHook } from "@/hooks/types/use-mutation-observer.types.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { useCallback, useId, useRef, useState } from "react";

const defaultOptions = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: false,
};

/**
 * Hook that creates and manages MutationObservers
 *
 * @description You can observe multiple elements by attaching the returned setRef to each target element.
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
  const observersRef = useRef(
    new UniqueSet<string, { observer: MutationObserver }>()
  );
  const idCounterRef = useRef(0);
  const nodeRef = useRef<Element>(null);
  const generatedNodeId = useId();

  const [state, setState] = useState<{
    observedRefs: UniqueSet<string, { element: Element }>;
    observer: MutationObserver;
  }>({
    observedRefs: new UniqueSet(),
    observer: null!,
  });

  /**
   * Automatically called when the setRef is set on an element as a ref.
   *
   * @param node - The target element to observe
   */
  const setRef = useCallback(
    (node?: Element) => {
      if (!node) {
        const disconnectedElement = Array.from(
          state.observedRefs.entries()
        ).find(([key, value]) => {
          const elem = value.element;

          if (!elem?.isConnected) {
            return key;
          }
        });

        if (!disconnectedElement) return;
        const [key] = disconnectedElement;
        const obs = observersRef.current.get(key);

        if (obs) {
          obs.observer.disconnect();
          observersRef.current.delete(key);
        }

        setState((prev) => ({
          ...prev,
          observedRefs: prev.observedRefs.clone().delete(key),
        }));

        nodeRef.current = null;
        return;
      }

      if (node === nodeRef.current) return;

      // Ensure the node has an id to be used as key; if not, generate and set one
      if (
        idCounterRef.current >= Number.MAX_SAFE_INTEGER ||
        idCounterRef.current >= 100
      ) {
        idCounterRef.current = 0;
      }

      const nodeKey =
        node.id || `mo-${generatedNodeId}-${++idCounterRef.current}`;
      if (!node.id) node.id = nodeKey;

      const existingObs = state.observedRefs.has(nodeKey);
      if (existingObs) return;

      nodeRef.current = node;

      const obs = new MutationObserver(callback);

      obs.observe(node, options);
      observersRef.current.set(node.id, { observer: obs });

      setState((prev) => ({
        ...prev,
        observedRefs: prev.observedRefs.clone().set(nodeKey, { element: node }),
        observer: obs,
      }));

      if (DEV_MODE) {
        console.debug(`useMutationObserver: observed node added -> ${nodeKey}`);
      }

      onNodeReady?.(node);
    },
    [callback, options, onNodeReady, generatedNodeId]
  );

  const deleteRef = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      observedRefs: prev.observedRefs.clone().delete(key),
    }));
  }, []);

  const clearRefs = useCallback(() => {
    setState((prev) => ({
      ...prev,
      observedRefs: new UniqueSet(),
    }));
  }, []);

  return {
    setRef,
    deleteRef,
    clearRefs,
    observedRefs: state.observedRefs,
    observer: state.observer,
  };
}
