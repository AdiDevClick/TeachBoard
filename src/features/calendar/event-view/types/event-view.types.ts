import type { eventInputs } from "@/features/calendar/event-view/form/event-view.inputs";
import type { PageWithControllers } from "@/types/AppPagesInterface";

/**
 * Types definition for the EventView component, which displays the details of a calendar event in a vertical drawer.
 */
export type EventViewProps = Readonly<
  Omit<PageWithControllers, "inputControllers"> & {
    inputControllers?: typeof eventInputs;
  }
>;
