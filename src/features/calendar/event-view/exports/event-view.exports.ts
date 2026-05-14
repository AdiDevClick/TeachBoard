import { lazyImport } from "@/utils/utils";

/**
 * Lazy loaded version of the EventView component, for performance optimization.
 * This ensures that the component is only loaded when needed, improving initial load times.
 */
export const LazyEventView = lazyImport(
  () => import("@/features/calendar/event-view/EventView"),
  "EventView",
);
