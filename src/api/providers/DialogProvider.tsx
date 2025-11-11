import { DialogContext } from "@/api/contexts/DialogContext.ts";
import { Dialog } from "@/components/ui/dialog.tsx";
import { useCallback, useMemo, useState, type PropsWithChildren } from "react";

/**
 * Provider for Dialog component.
 * Currently wrapping the whole application.
 *
 * @description Provides context for managing the state of the Dialog component.
 *
 * @param children  The child components that will have access to the Dialog context.
 * @returns The DialogProvider component that wraps its children with Dialog context.
 */
export function DialogProvider({ children }: Readonly<PropsWithChildren>) {
  const [dialogState, setDialogState] = useState(false);

  const openDialog = useCallback(() => {
    setDialogState(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState(false);
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setDialogState(open);
  }, []);

  const value = useMemo(
    () => ({
      isDialogOpen: dialogState,
      openDialog: openDialog,
      closeDialog: closeDialog,
      onOpenChange: onOpenChange,
    }),
    [dialogState]
  );

  return (
    <DialogContext.Provider value={value}>
      <Dialog open={dialogState} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    </DialogContext.Provider>
  );
}
