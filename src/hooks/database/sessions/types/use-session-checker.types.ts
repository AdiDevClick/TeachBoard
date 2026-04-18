import type {
  LastUserActivityDetails,
  LastUserActivityType,
} from "@/api/store/types/app-store.types";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types";
import type { QueryKeyDescriptor } from "@/hooks/database/types/QueriesTypes";

/**
 * Props for the switchSessionCases function, which determines the session state and triggers a session check if necessary.
 */
export type SwitchSessionCasesProps = {
  lastEntry?: [LastUserActivityType, LastUserActivityDetails];
  isPublicPage: boolean;
  sessionSynced: boolean;
};

/**
 * Parameters for the useSessionChecker hook, which checks the user's session status and handles session-related logic.
 */
export type useSessionCheckerParams = Partial<FetchParams> & {
  contentId?: QueryKeyDescriptor<unknown, unknown>["0"];
};
