import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";

/**
 * Defines the pagination buttons for the table component, including their icons and labels.
 *
 * Each button object contains:
 * - `key`: A unique identifier for the button action (e.g., "first", "previous", "next", "last").
 * - `icon`: The icon component to be displayed on the button.
 * - `label`: A descriptive label for the button, used for tooltips and accessibility.
 *
 * These buttons allow users to navigate through the pages of the table, providing a user-friendly interface for pagination.
 */
export const PAGINATION_BUTTONS = [
  {
    id: "first",
    icon: IconChevronsLeft,
    label: "Première page",
  },
  {
    id: "previous",
    icon: IconChevronLeft,
    label: "Page précédente",
  },
  {
    id: "next",
    icon: IconChevronRight,
    label: "Page suivante",
  },
  {
    id: "last",
    icon: IconChevronsRight,
    label: "Dernière page",
  },
] as const;

/**
 * Defines the label for the pagination size selector, which allows users to choose how many rows are displayed per page in the table.
 */
export const PAGINATION_SIZE_LABEL = "Lignes par page";

/**
 * Generates the pagination text based on the current page index and total page count.
 *
 * @param pageIndex The index of the current page.
 * @param pageCount The total number of pages.
 * @returns The pagination text.
 */
export const GENERATE_PAGINATION_COUNT = (
  pageIndex: number,
  pageCount: number,
) => `Page ${pageIndex + 1} sur ${pageCount}`;
