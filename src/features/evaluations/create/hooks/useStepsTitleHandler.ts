import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useEffect, useEffectEvent, useRef } from "react";

/**
 * Hook to handle the page title for the evaluation creation steps.
 *
 * @description This hook ensures that the page title is set during the creation process.
 * It listens for changes in the title stored in the evaluation steps creation store and updates the page title accordingly.
 */
export function useStepsTitleHandler() {
  const { setTitle, title: pageTitle } = usePageTitle();
  const { title: storeTitle } = useEvaluationStepsCreationStore();
  const isSyncingFromStoreRef = useRef(false);

  /**
   * Sync store title to the page title.
   *
   * @description This is the source of truth during step switch and edit rehydration.
   */
  const syncStoreTitleToPage = useEffectEvent((title: string | undefined) => {
    if (!title || title === pageTitle) return;

    isSyncingFromStoreRef.current = true;
    setTitle(title);
  });

  /**
   * Sync page title back to the store.
   *
   * @description Ignore the immediate page update coming from store sync to avoid re-writing stale values back to store.
   */
  const syncPageTitleToStore = useEffectEvent(
    (title: string | null | undefined) => {
      if (!title) return;

      if (isSyncingFromStoreRef.current) {
        isSyncingFromStoreRef.current = false;
        return;
      }

      if (title !== storeTitle) {
        useEvaluationStepsCreationStore.setState({ title });
      }
    },
  );

  useEffect(() => {
    syncStoreTitleToPage(storeTitle);
  }, [storeTitle]);

  useEffect(() => {
    syncPageTitleToStore(pageTitle);

    return () => {
      if (isSyncingFromStoreRef.current) {
        isSyncingFromStoreRef.current = false;
      }
    };
  }, [pageTitle, storeTitle]);
}
