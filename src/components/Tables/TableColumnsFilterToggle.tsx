import { withDropdownLayout } from "@/components/HOCs/withDropdownLayout";
import { useDataTableWithStore } from "@/components/Tables/hooks/useDataTable";
import type {
  TableColumnsFilterToggleProps,
  TableColumnsSelectionsProps,
} from "@/components/Tables/types/table-columns.types";
import { Button } from "@/components/ui/button";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { IconChevronDown, IconLayoutColumns } from "@tabler/icons-react";
import type { ComponentProps } from "react";

/**
 * Dropdown menu component to toggle table columns visibility.
 *
 * @param storeName - The name of the table store to access column visibility state and toggle functions.
 */
export function TableColumnsFilterToggle({
  storeName,
}: Readonly<TableColumnsFilterToggleProps>) {
  const props = {
    storeName,
    menu: {
      content: {
        className: "w-58",
      },
    },
  } satisfies ComponentProps<typeof Toggle>;

  return (
    <Toggle {...props}>
      <Toggle.Trigger>
        <Button variant="outline" size="sm">
          <IconLayoutColumns />
          <span className="hidden lg:inline">Personnaliser les colonnes</span>
          <span className="lg:hidden">Colonnes</span>
          <IconChevronDown />
        </Button>
      </Toggle.Trigger>
      <Toggle.Content />
    </Toggle>
  );
}

// The content of the menu
const Toggle = withDropdownLayout(TableColumnsSelections);

/**
 * Renders the list of columns with checkboxes to toggle their visibility in the table.
 *
 * @description The checkbox state reflects the current visibility of the column, and toggling it will show or hide the column accordingly.
 */
function TableColumnsSelections({
  storeName,
}: Readonly<TableColumnsSelectionsProps>) {
  const {
    table: { getAllColumns },
  } = useDataTableWithStore(storeName);

  return (
    <>
      {getAllColumns()
        .filter(
          (column) => column.accessorFn !== undefined && column.getCanHide(),
        )
        .map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
    </>
  );
}
