import withListMapper from "@/components/HOCs/withListMapper";
import { TabContent } from "@/components/Tabs/TabContent";

/**
 * @fileoverview A file containing exports related to the TabContent component, including the main TabContent component and a list mapper for handling multiple tab contents.
 *
 * @exports TabContent - The main component for rendering the content of a tab.
 */

/**
 * List component for mapping over multiple tab contents.
 */
export const TabContentList = withListMapper(TabContent);
