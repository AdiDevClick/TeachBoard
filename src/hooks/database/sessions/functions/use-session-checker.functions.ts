import { type DebugDetails, debugLogs } from "@/configs/app-components.config";
import type { SwitchSessionCasesProps } from "@/hooks/database/sessions/types/use-session-checker.types";

/**
 * Will determine if the session check should be submitted based on the last user activity and the current page.
 *
 * @param lastEntry - The last user activity entry, containing the activity type and details.
 * @param mode - The current session check mode for the page.
 * @param sessionSynced - A boolean indicating if the session is already synced.
 *
 * @returns A message describing the decision made regarding the session check.
 */
export function switchSessionCases({
  lastEntry,
  mode,
  sessionSynced,
}: SwitchSessionCasesProps) {
  const [activityName, activityDetails] = lastEntry ?? [
    "No recent activity",
    undefined,
  ];

  const lastActivityWasLogout = activityName === "logout";
  const lastActivityWasForbidden = activityDetails?.status === 403;
  const isPublicPage = mode === "publique";

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
 * Helper function to log session check details in a consistent format.
 */
export function sessionDebugs(details: Omit<DebugDetails, "type">) {
  debugLogs("useSessionChecker", {
    ...details,
    type: "sessionCheck",
  });
}
