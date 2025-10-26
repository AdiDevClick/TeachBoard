import type { NavQuickButtonProps } from "@/components/Sidebar/nav/types/QuickButtonTypes.ts";
import { Button } from "@/components/ui/button.tsx";

/**
 * Quick access button in the sidebar
 * @description When mounted, triggers the onMount callback to modify parent layout
 *
 * @param item - Quick button item data
 * @param onMount - Callback when the button is mounted
 * @returns
 */
export default function QuickButton({ item }: NavQuickButtonProps) {
  return (
    <>
      {item && (
        <Button
          size="icon"
          className="size-8 group-data-[collapsible=icon]:opacity-0"
          variant="outline"
        >
          {item.icon && <item.icon />}
          <span className="sr-only">Inbox</span>
        </Button>
      )}
    </>
  );
}
