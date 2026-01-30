import type { UniqueSet } from "@/utils/UniqueSet.ts";

/**
 * Mutation Observer Options
 */
export type MutationObserverOptions = {
  /** Indique si l'on observe les attributs. */
  attributes?: boolean;
  /** Indique si l'on observe les modifications du contenu textuel. */
  characterData?: boolean;
  /** Indique si l'on observe l'ajout/suppression de nœuds enfants. */
  childList?: boolean;
  /** Indique si l'observation concerne aussi les descendants. */
  subtree?: boolean;
};

export interface MutationObserverHook {
  callback?: MutationCallback;
  options?: MutationObserverOptions;
  onNodeReady?: (node: Element, meta?: Record<string, unknown>) => void;
}

type MetaType = Record<string, unknown>;

export type SetRefFunction = (node?: Element | null, meta?: MetaType) => void;

type ObserverRef = UniqueSet<string, StateData>;

export type UseMutationObserverReturn = {
  setRef?: SetRefFunction;
  observedRefs?: ObserverRef;
};

/**
 * State data for each observed element
 */
export type StateData = {
  element: Element;
  meta?: MetaType;
  observer: MutationObserver;
};

/**
 * State shape for useMutationObserver hook
 */
export type State = {
  observedRefs: ObserverRef;
  observer: MutationObserver;
};
