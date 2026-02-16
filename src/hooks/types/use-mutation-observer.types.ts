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
  mutationCallback?: MutationCallback;
  options?: MutationObserverOptions;
  onNodeReady?: (_node: Element, _meta?: Record<string, unknown>) => void;
}

type MetaType = Record<string, unknown>;

export type SetRefFunction = (_node?: Element | null, _meta?: MetaType) => void;

export type ObserverRef = UniqueSet<string, StateData>;

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
