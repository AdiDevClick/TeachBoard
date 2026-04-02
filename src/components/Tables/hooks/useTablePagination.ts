import { GENERATE_PAGINATION_COUNT } from "@/components/Tables/configs/pagination.configs";
import { PAGE_SIZE_OPTIONS } from "@/components/Tables/configs/table.config";
import { useDataTableWithStore } from "@/components/Tables/hooks/useDataTable";

/**
 * Hook that encapsulates the logic for managing pagination in the evaluation table, including page size selection, pagination text generation, and selection count. It interacts with the table instance to retrieve and update pagination state.
 */
export function useTablePagination(storeName?: string) {
  // mandatory
  "use no memo";

  const { table } = useDataTableWithStore(storeName);

  const {
    getState,
    getPageCount,
    setPageSize,
    getFilteredSelectedRowModel,
    getFilteredRowModel,
  } = table;

  const { pageIndex, pageSize } = getState().pagination;
  const paginationText = GENERATE_PAGINATION_COUNT(pageIndex, getPageCount());

  const size = String(pageSize);
  const pageSizeOptions = PAGE_SIZE_OPTIONS.map((option) => ({
    id: option.toString(),
    name: option.toString(),
  }));

  const selectionText = `${getFilteredSelectedRowModel().rows.length} sur ${getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).`;

  /**
   * Handler for changing the page size of the table.
   */
  function onValueChangeHandler(value: string) {
    const newSize = Number(value);

    if (!Number.isFinite(newSize) || newSize <= 0) {
      return;
    }

    setPageSize(newSize);
  }

  return {
    paginationText,
    pageSizeOptions,
    pageSize: size,
    onValueChangeHandler,
    selectionText,
    table,
  };
}
