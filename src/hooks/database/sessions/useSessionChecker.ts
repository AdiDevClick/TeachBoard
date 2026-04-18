import { useAppStore } from "@/api/store/AppStore";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  doesContainNoSessionPage,
  USER_ACTIVITIES,
} from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import {
  activateSessionCheck,
  sessionDebugs,
  switchSessionCases,
} from "@/hooks/database/sessions/functions/use-session-checker.functions";
import type { useSessionCheckerParams } from "@/hooks/database/sessions/types/use-session-checker.types";
import { useEffect, useEffectEvent } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook to check user session.
 *
 * @returns An object containing session check data, loading state, query function, loaded state, and any error encountered.
 */
export function useSessionChecker({
  contentId = USER_ACTIVITIES.sessionCheck,
  url = API_ENDPOINTS.POST.AUTH.SESSION_CHECK,
  method = API_ENDPOINTS.POST.METHOD,
}: useSessionCheckerParams = {}) {
  const { clearUserStateOnError, updateSession } = useAppStore();
  const sessionSynced = useAppStore((state) => state.sessionSynced);
  const lastUserActivity = useAppStore((state) => state.lastUserActivity);

  const { setFetchParams, data, isLoading, isLoaded, error } =
    useCommandHandler({
      pageId: "none",
      form: null!,
    });

  const location = decodeURI(useLocation().pathname);

  /**
   * The success handler callback for the session check query.
   *
   * @description It updates the session state with the latest activity and logs the success details.
   */
  function onSuccess(data: unknown) {
    updateSession(true, contentId, { url: location });
    sessionDebugs({
      data,
      message: "Session Check onSuccess",
    });
  }

  /**
   * The error handler callback for the session check query.
   *
   * @description It clears the user state and logs the error details.
   */
  function onError(error: unknown) {
    clearUserStateOnError();
    sessionDebugs({
      error,
      message: "Session Check onError - User state cleared",
    });
  }

  /**
   * Modify the fetch parameters to trigger a session check query.
   */
  function triggerSessionCheck() {
    activateSessionCheck({
      setState: setFetchParams,
      contentId,
      url,
      method,
      onSuccess,
      onError,
    });
  }

  /**
   * Init -
   *
   * @description Automatically check session on page load
   *
   * @remark  Some cases may not trigger a query to the server - see {@link switchSessionCases}
   */
  const verifyActivities = useEffectEvent((location: string) => {
    const lastEntry = lastUserActivity.entries().next().value;

    const isPublicPage = doesContainNoSessionPage(location);

    const result = switchSessionCases({
      lastEntry,
      isPublicPage,
      sessionSynced,
    });

    if (result.shouldTriggerQuery) {
      triggerSessionCheck();
    }

    sessionDebugs({
      location,
      message: result.message,
    });
  });

  /**
   * Init -
   *
   * @description On every page load
   */
  useEffect(() => {
    verifyActivities(location);
  }, [location]);

  return { data, isLoading, isLoaded, error };
}
