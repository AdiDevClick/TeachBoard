import type { Table } from "@tanstack/react-table";

/**
 * Determine if a pagination button should be disabled based on the current state of the table.
 *
 * @param id - The identifier of the pagination button (e.g., "first", "previous", "next", "last").
 * @param tableState - The current state of the table, used to determine if there are previous or next pages available.
 *
 * @Returns `true` if the button should be disabled, `false` otherwise.
 */
export function disableButtonHandler<T>(id: string, tableState: Table<T>) {
  const { getCanPreviousPage, getCanNextPage } = tableState;

  if (id === "first" || id === "previous") {
    return !getCanPreviousPage();
  }

  return !getCanNextPage();
}

/**
 * Handle pagination button clicks by updating the table's page index based on the button clicked.
 *
 * @param id - The identifier of the pagination button that was clicked (e.g., "first", "previous", "next", "last").
 * @param tableState - The current state of the table, used to update the page index accordingly.
 */
export function paginationClickHandler<T>(id: string, tableState: Table<T>) {
  const { getPageCount, previousPage, nextPage, setPageIndex } = tableState;

  switch (id) {
    case "first":
      setPageIndex(0);
      break;
    case "previous":
      previousPage();
      break;
    case "next":
      nextPage();
      break;
    case "last":
      setPageIndex(getPageCount() - 1);
      break;
  }
}
