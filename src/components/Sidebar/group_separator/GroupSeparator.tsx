import { SidebarGroup } from "@/components/ui/sidebar.tsx";
import "@css/Separator.scss";
import { Separator } from "@radix-ui/react-separator";

/**
 * Group separator for sidebar elements
 */
export default function GroupSeparator() {
  return (
    <SidebarGroup>
      <Separator className="separator" />
    </SidebarGroup>
  );
}
