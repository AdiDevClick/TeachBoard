import { DialogContext } from "@/api/contexts/Dialog.context";
import type { AppModalNames } from "@/configs/app.config.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import type { PreventDefaultAndStopPropagation } from "@/utils/types/types.utils.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
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
  const [openDialogs, setOpenDialogs] = useState<UniqueSet<AppModalNames, any>>(
    new UniqueSet()
  );
  const { setRef, observedRefs, deleteRef } = useMutationObserver({});

  const openDialog = useCallback(
    (e: PreventDefaultAndStopPropagation, id: AppModalNames, options?: any) => {
      preventDefaultAndStopPropagation(e);
      setOpenDialogs((prev) => {
        const next = prev.clone();
        next.set(id, options ?? {});
        return next;
      });
    },
    []
  );

  const closeDialog = useCallback(
    (e: PreventDefaultAndStopPropagation, id?: AppModalNames) => {
      preventDefaultAndStopPropagation(e);
      setOpenDialogs((prev) => {
        const next = prev.clone();
        if (id) {
          next.delete(id);
          deleteRef(id);
        } else {
          // If no ID provided, close the most recent dialog
          const lastId = Array.from(next.entries()).pop();
          if (lastId) {
            next.delete(lastId);
            deleteRef(lastId);
          }
        }
        return next;
      });
    },
    []
  );

  const closeAllDialogs = useCallback(() => {
    if (openDialogs.size === 0) return;
    setOpenDialogs(new UniqueSet());
  }, [openDialogs]);

  const isDialogOpen = useCallback(
    (id: AppModalNames) => {
      return openDialogs.has(id);
    },
    [openDialogs]
  );

  const onOpenChange = useCallback((id: AppModalNames) => {
    setOpenDialogs((prev) => {
      const next = prev.clone();
      next.delete(id);
      return next;
    });
  }, []);

  const setDialogOptions = useCallback((id: AppModalNames, options: any) => {
    setOpenDialogs((prev) => {
      const next = prev.clone();
      if (next.has(id)) {
        next.set(id, {
          ...next.get(id),
          ...options,
        });
      }
      return next;
    });
  }, []);

  const dialogsOptions = useMemo(() => {
    return new Map(openDialogs.entries());
  }, [openDialogs]);

  const dialogOptions = useCallback(
    (dialog) => {
      return openDialogs.get(dialog);
    },
    [openDialogs]
  );

  const value = useMemo(
    () => ({
      openedDialogs: Array.from(openDialogs.entries()),
      dialogsOptions,
      dialogOptions,
      setDialogOptions,
      isDialogOpen,
      openDialog,
      closeDialog,
      onOpenChange,
      closeAllDialogs,
      setRef,
      deleteRef,
      observedRefs,
    }),
    [openDialogs, observedRefs]
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}
