import { DialogContext } from "@/api/contexts/DialogContext.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { PreventDefaultAndStopPropagation } from "@/utils/types/types.utils.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { useCallback, useMemo, useState, type PropsWithChildren } from "react";

/**
 * Provider for Dialog component.
 * Currently wrapping the whole application.
 *
 * @description Provides context for managing the state of the Dialog component.
 * Uses a stack-based approach to handle nested/multiple dialogs simultaneously.
 *
 * @param children  The child components that will have access to the Dialog context.
 * @returns The DialogProvider component that wraps its children with Dialog context.
 */
export function DialogProvider({ children }: Readonly<PropsWithChildren>) {
  // Use a Set to track all open dialog IDs (supports multiple dialogs)
  const [openDialogs, setOpenDialogs] = useState<Set<AppModalNames>>(new Set());

  const openDialog = useCallback(
    (e: PreventDefaultAndStopPropagation, id: AppModalNames) => {
      preventDefaultAndStopPropagation(e);
      setOpenDialogs((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    },
    []
  );

  const openedDialogs = useMemo(() => Array.from(openDialogs), [openDialogs]);

  const closeDialog = useCallback(
    (e: PreventDefaultAndStopPropagation, id?: AppModalNames) => {
      preventDefaultAndStopPropagation(e);
      setOpenDialogs((prev) => {
        const next = new Set(prev);
        if (id) {
          next.delete(id);
        } else {
          // If no ID provided, close the most recent dialog
          const lastId = Array.from(next).pop();
          if (lastId) next.delete(lastId);
        }
        return next;
      });
    },
    []
  );

  const closeAllDialogs = useCallback(() => {
    setOpenDialogs(new Set());
  }, []);

  const isDialogOpen = useCallback(
    (id: AppModalNames) => {
      return openDialogs.has(id);
    },
    [openDialogs]
  );

  const onOpenChange = useCallback((id: AppModalNames) => {
    setOpenDialogs((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      openedDialogs,
      isDialogOpen,
      openDialog,
      closeDialog,
      onOpenChange,
      closeAllDialogs,
    }),
    [openDialogs]
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}
