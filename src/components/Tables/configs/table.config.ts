/**
 * This file contains configuration constants for the DataTable component, such as default page size and page size options.
 */

/**
 * Default page size for the DataTable component.
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Page size options for the DataTable component.
 */
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

/**
 * List of actions available in the evaluation table, including "Consulter", "Editer", and "Supprimer" (with a destructive variant).
 */
export const ACTIONS_LIST = [
  {
    label: "Consulter",
  },
  {
    label: "Editer",
  },
  {
    label: "Supprimer",
    variant: "destructive",
  },
] as const;
