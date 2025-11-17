import type { InpageTabsProps } from "@/components/InPageNavTabs/types/navtabs.types.ts";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import VerticalFieldSelect from "@/components/Selects/VerticalFieldSelect";
import { SelectGroup, SelectItem } from "@/components/ui/select.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@css/NavTabs.scss";

/**
 * In-page navigation tabs component
 *
 * @description Renders navigation tabs depending on device type
 *
 * @param datas  - Props for the InpageTabs component
 * @param value  - Current selected tab value
 * @param onValueChange - Callback when the tab value changes
 */
export function InpageTabs({
  datas,
  value,
  onValueChange,
}: Readonly<InpageTabsProps>) {
  const { isMobile } = useSidebar();

  if (isMobile) {
    return (
      <VerticalFieldSelect
        className="nav-tabs-container"
        placeholder="Etapes..."
        value={value}
        onValueChange={onValueChange}
      >
        <SelectGroup className="nav-tabs__select-group">
          <ListMapper items={datas}>
            {([key, item]) => (
              <SelectItem key={key} value={item.name}>
                {item.name}
              </SelectItem>
            )}
          </ListMapper>
        </SelectGroup>
      </VerticalFieldSelect>
    );
  }

  return (
    <TabsList className="nav-tabs-container">
      {Object.entries(datas).map(([key, item]) => (
        <TabsTrigger key={key} value={item.name}>
          {item.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
