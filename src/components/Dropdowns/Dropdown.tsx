import type { DropdownsProps } from "@/components/Dropdowns/types/DropdownsTypes.ts";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx";

/**
 * Dropdown component for rendering a single dropdown item.
 * @param item - The dropdown item to render.
 * @returns The rendered dropdown item.
 */
export function Dropdown({ ...item }: DropdownsProps) {
  const { title, icon: Icon, divider } = item;

  // const id = useId();

  return (
    <>
      {divider && <DropdownMenuSeparator />}
      <DropdownMenuItem>
        {Icon && <Icon />}
        {title}
      </DropdownMenuItem>
    </>
  );
}
