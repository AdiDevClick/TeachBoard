import { type DebugDetails, debugLogs } from "@/configs/app-components.config";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types";
import type { SwitchSessionCasesProps } from "@/hooks/database/sessions/types/use-session-checker.types";
import type { Dispatch, SetStateAction } from "react";

/**
 * Will determine if the session check should be submitted based on the last user activity and the current page.
 *
 * @param lastEntry - The last user activity entry, containing the activity type and details.
 * @param isPublicPage - A boolean indicating if the current page is public (does not require a session).
 * @param sessionSynced - A boolean indicating if the session is already synced.
 * 
 * @returns A message describing the decision made regarding the session check.

 */
export function switchSessionCases({
  lastEntry,
  isPublicPage,
  sessionSynced,
}: SwitchSessionCasesProps) {
  const [activityName, activityDetails] = lastEntry ?? [
    "No recent activity",
    undefined,
  ];

  const lastActivityWasLogout = activityName === "logout";
  const lastActivityWasForbidden = activityDetails?.status === 403;

  let message = "";
  let shouldTriggerQuery = false;

  switch (true) {
    case lastActivityWasForbidden && isPublicPage:
    case lastActivityWasLogout && isPublicPage:
    case isPublicPage:
      message = "Current page is public. No session check needed.";
      break;
    case sessionSynced:
      message = "Session is already synced. No session check needed.";
      break;
    default:
      message = "Performing session check on page load...";
      shouldTriggerQuery = true;
  }

  return { message, shouldTriggerQuery };
}

/**
 * A simple helper to set the fetch parameters
 *
 * @param props - An object containing the fetch parameters and a function to set them.
 */
export function activateSessionCheck(
  props: FetchParams & { setState: Dispatch<SetStateAction<FetchParams>> },
) {
  const { setState, ...rest } = props;

  setState({
    ...rest,
    successDescription: "Session checked successfully.",
    silent: true,
  });
}

/**
 * Helper function to log session check details in a consistent format.
 */
export function sessionDebugs(details: Omit<DebugDetails, "type">) {
  debugLogs("useSessionChecker", {
    ...details,
    type: "sessionCheck",
  });
}
