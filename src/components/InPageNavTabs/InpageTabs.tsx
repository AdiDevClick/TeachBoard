import VerticalFieldSelect from "@/components/Selects/VerticalFieldSelect";
import { SelectGroup, SelectItem } from "@/components/ui/select.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@css/NavTabs.scss";

/**
 *
 */
type InpageTabsProps = {
  datas: Record<string, unknown>;
  value?: string;
  onValueChange?: (value: string) => void;
};

/**
 * In-page navigation tabs component
 *
 * @description Renders navigation tabs depending on device type
 *
 * @param datas  - Props for the InpageTabs component
 * @param value  - Current selected tab value
 * @param onValueChange - Callback when the tab value changes
 */
export function InpageTabs({ datas, value, onValueChange }: InpageTabsProps) {
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
          {Object.entries(datas).map(([key, item]) => (
            <SelectItem key={key} value={item.tabTitle}>
              {item.tabTitle}
            </SelectItem>
          ))}
        </SelectGroup>
      </VerticalFieldSelect>
    );
  }

  return (
    <TabsList className="nav-tabs-container">
      {Object.entries(datas).map(([key, item]) => (
        <TabsTrigger key={key} value={item.tabTitle}>
          {item.tabTitle}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
