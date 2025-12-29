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
