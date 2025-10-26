import type { dataContext } from "@/api/providers/types/SidebarDataProviderTypes.ts";

/** Props for the UserDisplay component */
export type UserDisplayProps = {
  props: dataContext["user"];
};
