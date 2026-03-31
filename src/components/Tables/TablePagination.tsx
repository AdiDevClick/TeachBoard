import { PaginationButtons } from "@/components/Buttons/exports/buttons.exports";
import withListMapper from "@/components/HOCs/withListMapper";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem";
import VerticalFieldSelect from "@/components/Selects/VerticalFieldSelect";
import {
  PAGINATION_BUTTONS,
  PAGINATION_SIZE_LABEL,
} from "@/components/Tables/configs/pagination.configs";
import {
  disableButtonHandler,
  paginationClickHandler,
} from "@/components/Tables/functions/table-pagination.functions";
import { useTablePagination } from "@/components/Tables/hooks/useTablePagination";
import type { TablePaginationProps } from "@/components/Tables/types/table-pagination.types";

/**
 * Component responsible for the pagination controls of the evaluation table, including page size selection and navigation buttons.
 */
export function TablePagination({
  storeName,
  label = PAGINATION_SIZE_LABEL,
  paginationButtons = PAGINATION_BUTTONS,
}: TablePaginationProps) {
  // mandatory
  "use no memo";

  const {
    table,
    paginationText,
    selectionText,
    pageSize,
    onValueChangeHandler,
    pageSizeOptions,
  } = useTablePagination(storeName);

  return (
    <div className="flex items-center justify-between px-4">
      <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
        {selectionText}
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <VerticalFieldSelect
          label={label}
          value={pageSize}
          onValueChange={onValueChangeHandler}
          placeholder={pageSize}
          className="hidden items-center gap-2 lg:flex"
          triggerProps={{ className: "w-20" }}
          labelProps={{ className: "text-sm font-medium" }}
        >
          <SelectItems items={pageSizeOptions} />
        </VerticalFieldSelect>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          {paginationText}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <PaginationButtons
            items={paginationButtons}
            optional={({ id }) => ({
              onClick: () => paginationClickHandler(id, table),
              disabled: disableButtonHandler(id, table),
            })}
          />
        </div>
      </div>
    </div>
  );
}

const SelectItems = withListMapper(NonLabelledGroupItem);
