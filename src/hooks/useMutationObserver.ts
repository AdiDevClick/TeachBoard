import { DEV_MODE, NO_MUTATION_OBSERVER_LOGS } from "@/configs/app.config.ts";
import type {
  MutationObserverHook,
  State,
  StateData,
} from "@/hooks/types/use-mutation-observer.types.ts";
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
  const observersRef = useRef(new UniqueSet<string, StateData>());
  const idCounterRef = useRef(0);
  const nodeRef = useRef<Element>(null);
  const generatedNodeId = useId();
  const hookId = useId();

  const [state, setState] = useState<State>({
    observedRefs: new UniqueSet<string, StateData>(),
    observer: null!,
  });

  /**
   * Deletes the observer and reference for a given key.
   *
   * @param key - The key of the observed element to delete
   */
  const deleteRef = useCallback((key: string) => {
    const obs = observersRef.current.get(key);

    if (obs) {
      obs.observer.disconnect();
      observersRef.current.delete(key);
    }

    setState((prev) => ({
      ...prev,
      observedRefs: observersRef.current.clone(),
    }));
  }, []);

  /**
   * Automatically called when the setRef is set on an element as a ref.
   *
   * @param node - The target element to observe
   */
  const setRef = useCallback(
    (node?: Element | null, meta?: Record<string, unknown>) => {
      if (!node) {
        const disconnectedElement = Array.from(
          observersRef.current.entries(),
        ).find(([key, value]) => {
          const elem = value.element;

          if (!elem?.isConnected) {
            return key;
          }
        });

        if (!disconnectedElement) return;
        const [key] = disconnectedElement;

        deleteRef(key);

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

      const generatedNodeKey = `mo-${generatedNodeId}-${++idCounterRef.current}`;
      if (!node.id) node.id = (meta?.id as string) ?? generatedNodeKey;

      const existingObs = observersRef.current.has(node.id);

      if (existingObs) {
        const prevEntry = observersRef.current.get(node.id);
        const prevMeta = prevEntry?.meta ?? null;
        const newMeta = meta ?? null;

        if (prevMeta === newMeta) return;

        setState((prev) => {
          const prevStr = JSON.stringify(prevMeta);
          const newStr = JSON.stringify(newMeta);

          if (prevStr !== newStr) {
            observersRef.current.set(node.id, {
              observer: prevEntry!.observer,
              element: node,
              meta,
            });

            return {
              ...prev,
              observedRefs: observersRef.current.clone(),
            };
          }

          return prev;
        });
        return;
      }

      nodeRef.current = node;
      const obs = new MutationObserver(callback);

      obs.observe(node, options);
      observersRef.current.set(node.id, { observer: obs, element: node, meta });

      setState((prev) => ({
        ...prev,
        observedRefs: observersRef.current.clone(),
        observer: obs,
      }));

      if (DEV_MODE && !NO_MUTATION_OBSERVER_LOGS) {
        console.debug(
          `useMutationObserver[${hookId}]: observed node added -> ${node.id}`,
        );
      }

      onNodeReady?.(node, meta);
    },
    [callback, options, onNodeReady, generatedNodeId, hookId],
  );

  /**
   * Clears all observers and references.
   */
  const clearRefs = useCallback(() => {
    observersRef.current.forEach((entry, key) => {
      entry.observer.disconnect();
      observersRef.current.delete(key);
    });

    setState((prev) => ({
      ...prev,
      observedRefs: observersRef.current.clone(),
    }));
  }, []);

  /**
   * Find metadata for a given key.
   *
   * @param key - The key of the observed element
   *
   * @returns The metadata associated with the observed element, if any
   */
  const findMetadata = useCallback((key: string) => {
    return observersRef.current.get(key)?.meta;
  }, []);

  /**
   * Find an observed entry by its metadata id or name.
   *
   * @description Use this if you need to locate an observed element based on its metadata.
   *
   * @param idOrName - The id or name to search for in metadata
   *
   * @returns The observed entry if found, otherwise undefined
   */
  const findByMeta = useCallback((idOrName: string) => {
    for (const [, entry] of observersRef.current.entries()) {
      const meta = entry?.meta;
      if (!meta) continue;
      if ((meta.id ?? meta.name ?? "") === idOrName) return entry;
    }
    return undefined;
  }, []);

  return {
    setRef,
    deleteRef,
    clearRefs,
    observedRefs: state.observedRefs,
    observer: state.observer,
    findMetadata,
    findByMeta,
  };
}
