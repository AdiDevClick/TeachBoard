import { DialogContext } from "@/api/contexts/DialogContext.ts";
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
  const [openDialogs, setOpenDialogs] = useState<Set<string>>(new Set());

  const openDialog = useCallback((id: string) => {
    setOpenDialogs((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const closeDialog = useCallback((id?: string) => {
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
  }, []);

  const isDialogOpen = useCallback(
    (id: string) => {
      return openDialogs.has(id);
    },
    [openDialogs]
  );

  const onOpenChange = useCallback((id: string) => {
    setOpenDialogs((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      isDialogOpen,
      openDialog,
      closeDialog,
      onOpenChange,
    }),
    [openDialogs]
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}
