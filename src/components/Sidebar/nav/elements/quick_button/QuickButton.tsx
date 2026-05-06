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
export default function QuickButton({
  item,
  enabled = true,
}: Readonly<NavQuickButtonProps>) {
  if (!item || !enabled) {
    return null;
  }

  return (
    <>
      {item && (
        <Button
          size="icon"
          className="sidebarButton--quickbutton"
          variant="outline"
        >
          {item.icon && <item.icon />}
          <span className="sr-only">Inbox</span>
        </Button>
      )}
    </>
  );
}
