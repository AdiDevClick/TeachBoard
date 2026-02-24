import withListMapper from "@/components/HOCs/withListMapper";
import { TabContent } from "@/features/evaluations/create/components/Tabs/TabContent";
import { createComponentName } from "@/utils/utils";

/**
 * @fileoverview A file containing exports related to the TabContent component, including the main TabContent component and a list mapper for handling multiple tab contents.
 *
 * @exports TabContent - The main component for rendering the content of a tab.
 */

/**
 * List component for mapping over multiple tab contents.
 */
export const TabContentList = withListMapper(TabContent);
createComponentName("withListMapper", "TabContentList", TabContentList);
