import {
  getMatchingLoader,
  getPrevsTitles,
} from "@/hooks/functions/use-page-title.functions";
import { type PageTitleState } from "@/hooks/types/use-page-title.types";
import { UniqueSet } from "@/utils/UniqueSet";
import { useEffect, useEffectEvent, useSyncExternalStore } from "react";
import { useLocation, useMatches } from "react-router-dom";

const DEFAULT_TITLE = "TeachBoard";

const pageTitleStore = (() => {
  let state: PageTitleState = {
    isEditing: false,
    routesTitles: new UniqueSet(null),
  };
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setState: (updater: (prev: PageTitleState) => PageTitleState) => {
      state = updater(state);
      listeners.forEach((listener) => listener());
    },
  };
})();

/**
 * Hook to manage the page title state and editing
 *
 * @description It uses the route loader data to initialize the title as the original title for the route and allows to edit it.
 *
 * @remarks The title is stored in a shared state so that both the page header and page content can read and update the same title.
 */
export function usePageTitle() {
  const location = decodeURI(useLocation().pathname);
  const matchingLoader = getMatchingLoader(useMatches, location);
  const routeId = matchingLoader?.id ?? location;

  const state = useSyncExternalStore(
    pageTitleStore.subscribe,
    pageTitleStore.getState,
  );

  const currentTitle = matchingLoader?.loaderData?.pageTitle ?? DEFAULT_TITLE;
  const isTitleHidden = currentTitle === "hidden";

  /**
   * INIT Trigger -
   *
   * @description Makes sure to init the title state -
   * It will save the loader title as the original title for the route and set the current title to it if not already set
   */
  const triggerTitleChange = useEffectEvent((currentTitle: string) => {
    pageTitleStore.setState((prev) => ({
      ...prev,
      routesTitles: prev.routesTitles
        .set(routeId, getPrevsTitles(routeId, currentTitle, prev))
        .clone(),
    }));
  });

  /**
   * INIT -
   * @description On route change (id or title change)
   */
  useEffect(() => {
    triggerTitleChange(currentTitle);
  }, [currentTitle, isTitleHidden, routeId]);

  return {
    title: state.routesTitles.get(routeId)?.title,
    isTitleHidden,
    isEditing: state.isEditing,
    setTitle: (title: string = "default") => {
      pageTitleStore.setState((prev) => {
        const { title: previousTitle, originalTitle } =
          prev.routesTitles.get(routeId) ?? {};
        const selectedTitle = title === "default" ? currentTitle : title;

        if (selectedTitle === previousTitle) {
          return prev;
        }

        return {
          ...prev,
          routesTitles: prev.routesTitles
            .set(routeId, {
              originalTitle: originalTitle ?? currentTitle,
              title: selectedTitle,
            })
            .clone(),
        };
      });
    },
    setIsEditing: (isEdit?: boolean) => {
      pageTitleStore.setState((prev) => ({
        ...prev,
        isEditing: isEdit ?? !prev.isEditing,
      }));
    },
  };
}
