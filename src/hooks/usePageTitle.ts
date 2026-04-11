import {
  getMatchingLoader,
  getPrevsTitles,
} from "@/hooks/functions/use-page-title.functions";
import { type PageTitleState } from "@/hooks/types/use-page-title.types";
import { UniqueSet } from "@/utils/UniqueSet";
import { useEffect, useEffectEvent, useState } from "react";
import { useLocation, useMatches } from "react-router-dom";

const DEFAULT_TITLE = "TeachBoard";

/**
 * Hook to manage the page title state and editing
 *
 * @description It uses the route loader data to initialize the title as the original title for the route and allows to edit it.
 *
 * @remarks The title is stored in a state with the route id as key to keep track of titles for different routes.
 */
export function usePageTitle() {
  const location = decodeURI(useLocation().pathname);
  const matchingLoader = getMatchingLoader(useMatches, location);
  const routeId = matchingLoader?.id ?? location;

  const [state, setState] = useState<PageTitleState>(() => ({
    isEditing: false,
    routesTitles: new UniqueSet(null, [
      [routeId, { title: null, originalTitle: null }],
    ]),
  }));

  const currentTitle = matchingLoader?.loaderData?.pageTitle ?? DEFAULT_TITLE;
  const isTitleHidden = currentTitle === "hidden";

  /**
   * INIT Trigger -
   *
   * @description Makes sure to init the title state -
   * It will save the loader title as the original title for the route and set the current title to it if not already set
   */
  const triggerTitleChange = useEffectEvent((currentTitle: string) => {
    setState((prev) => ({
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
    setTitle: (title: string) => {
      setState((prev) => {
        const previous = prev.routesTitles.get(routeId);

        return {
          ...prev,
          routesTitles: prev.routesTitles
            .set(routeId, {
              ...previous!,
              title,
            })
            .clone(),
        };
      });
    },
    setIsEditing: (isEdit?: boolean) => {
      if (isEdit !== undefined) {
        setState((prev) => ({ ...prev, isEditing: isEdit }));
        return;
      }

      setState((prev) => ({ ...prev, isEditing: !prev.isEditing }));
    },
  };
}
