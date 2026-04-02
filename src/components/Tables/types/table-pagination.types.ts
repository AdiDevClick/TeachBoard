import type { PAGINATION_BUTTONS } from "@/components/Tables/configs/pagination.configs";

/**
 * Props for the TablePagination component, allowing customization of the page size label and pagination buttons.
 */
export type TablePaginationProps = Readonly<{
  /** The name of the table store to use for pagination state management. */
  storeName?: string;
  /** The label for the page size selection dropdown. */
  label?: string;
  /** The configuration for the pagination buttons, including their icons and labels. */
  paginationButtons?: typeof PAGINATION_BUTTONS;
}>;
