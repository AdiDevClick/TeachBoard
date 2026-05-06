import { useAppStore } from "@/api/store/AppStore";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { SessionCheckMode } from "@/configs/app.config.ts";
import { getSessionCheckMode, USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import {
  sessionDebugs,
  switchSessionCases,
} from "@/hooks/database/sessions/functions/use-session-checker.functions";
import type { useSessionCheckerParams } from "@/hooks/database/sessions/types/use-session-checker.types";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";

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
  const location = decodeURI(useLocation().pathname);
  const mode = getSessionCheckMode(location);
  const [secureAllowedByLocation, setSecureAllowedByLocation] = useState(
    () => ({ [location]: mode !== "secure" }),
  );

  const secureAllowed = secureAllowedByLocation[location] ?? mode !== "secure";

  const {
    sessionSynced,
    isLoggedIn,
    lastUserActivity,
    clearUserStateOnError,
    updateSession,
  } = useAppStore(
    useShallow((state) => ({
      sessionSynced: state.sessionSynced,
      isLoggedIn: state.isLoggedIn,
      lastUserActivity: state.lastUserActivity,
      clearUserStateOnError: state.clearUserStateOnError,
      updateSession: state.updateSession,
    })),
  );

  const safeToDisplay =
    mode !== "secure" || (secureAllowed && (isLoggedIn || sessionSynced));
  const navigate = useNavigate();
  const sessionCheckRef = useRef({
    latestLocation: location,
    lastCheckedPath: null as string | null,
    previousIsLoggedIn: isLoggedIn,
  });

  const { setFetchParams, openDialog, data, isLoading, isLoaded, error } =
    useCommandHandler({
      pageId: "session-check",
      form: null!,
    });

  /**
   * Modify the fetch parameters to trigger a session check query.
   */
  function triggerSessionCheck() {
    const requestLocation = location;
    const requestMode = getSessionCheckMode(requestLocation);

    setFetchParams({
      contentId,
      url,
      method,
      silent: true,
      onSuccess(data: unknown) {
        updateSession(true, contentId, { url: requestLocation });

        if (
          requestMode === "secure" &&
          requestLocation === sessionCheckRef.current.latestLocation
        ) {
          setSecureAllowedByLocation((previous) => ({
            ...previous,
            [requestLocation]: true,
          }));
        }

        sessionDebugs({
          data,
          message:
            "Session check completed successfully. User is authenticated.",
        });
      },
      onError(error: unknown) {
        if (requestLocation === sessionCheckRef.current.latestLocation) {
          if (requestMode === "secure") {
            setSecureAllowedByLocation((previous) => ({
              ...previous,
              [requestLocation]: false,
            }));
          }

          showLoginModalToUser(requestMode, requestLocation);
        }

        sessionDebugs({
          error,
          message: `Session check failed in '${requestMode}' mode. Showing login modal.`,
        });

        clearUserStateOnError();
      },
      successDescription() {
        return {
          type: "success",
          descriptionMessage: "Session check succeeded.",
        };
      },
    });
  }

  /**
   * Show login modal to user when no active session is found
   *
   * @description This is a gentle reminder for users to log in without redirecting them away from the current page, providing a smoother user experience.
   *
   * @remark !!! IMPORTANT !! Keep in mind that this approach assumes the users will interact with the login modal when it appears or they may continue exploring the site.
   *
   * @important Please, use the useSessionChecker hook in your critical components and ensure a check before fetching as the server will immediately return an error uppon invalid session, which will force trigger a redirection to the login page.
   */
  const showLoginModalToUser = (
    currentMode: SessionCheckMode,
    requestLocation: string,
  ) => {
    if (requestLocation === "/login") {
      return;
    }

    sessionDebugs({
      location: requestLocation,
      message: "No active session found. A dialog has been opened for login.",
    });

    openDialog(null, "login", {
      onClose: () => {
        if (currentMode === "soft") {
          return;
        }

        const destination = useAppStore.getState().isLoggedIn ? "/" : "/login";
        navigate(destination, { replace: true });
      },
    });
  };

  /**
   * @description This will log a loading triggered
   */
  useEffect(() => {
    if (isLoading) {
      sessionDebugs({
        location,
        message: "Session check is loading...",
      });
    }
  }, [isLoading, location]);

  /**
   * Init -
   *
   * @description Automatically check session on page load
   *
   * @remark  Some cases may not trigger a query to the server - see {@link switchSessionCases}
   */
  const verifyActivities = useEffectEvent((location: string) => {
    const lastEntry = lastUserActivity.entries().next().value;
    const currentMode = getSessionCheckMode(location);

    const result = switchSessionCases({
      lastEntry,
      mode: currentMode,
      sessionSynced,
    });

    if (result.shouldTriggerQuery) {
      triggerSessionCheck();
    } else if (currentMode === "secure") {
      setSecureAllowedByLocation((previous) => ({
        ...previous,
        [location]: true,
      }));
    }

    sessionDebugs({
      location,
      message: result.message,
    });
  });

  const triggerSessionCheckOnLogin = useEffectEvent(() => {
    triggerSessionCheck();
  });

  /**
   * Init -
   *
   * @description On every page load
   */
  useEffect(() => {
    sessionCheckRef.current.latestLocation = location;

    if (sessionCheckRef.current.lastCheckedPath === location) {
      return;
    }

    sessionCheckRef.current.lastCheckedPath = location;

    verifyActivities(location);
  }, [location]);

  useEffect(() => {
    const hasJustLoggedIn =
      !sessionCheckRef.current.previousIsLoggedIn && isLoggedIn;

    sessionCheckRef.current.previousIsLoggedIn = isLoggedIn;

    if (!hasJustLoggedIn || mode !== "secure" || safeToDisplay || isLoading) {
      return;
    }

    sessionDebugs({
      location,
      message:
        "User just logged in on a secure route. Triggering session check to unlock content.",
    });

    triggerSessionCheckOnLogin();
  }, [isLoggedIn, isLoading, location, mode, safeToDisplay]);

  return { data, isLoading, isLoaded, error, safeToDisplay };
}
