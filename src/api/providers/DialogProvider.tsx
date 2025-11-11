import { DialogContext } from "@/api/contexts/DialogContext.ts";
import { Dialog } from "@/components/ui/dialog.tsx";
import { useMemo, useState, type PropsWithChildren } from "react";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const value = useMemo(
    () => ({
      isDialogOpen,
      openDialog: setIsDialogOpen,
    }),
    [isDialogOpen]
  );

  return (
    <DialogContext.Provider value={value}>
      <Dialog open={value.isDialogOpen} onOpenChange={setIsDialogOpen}>
        {children}
      </Dialog>
    </DialogContext.Provider>
  );
}
