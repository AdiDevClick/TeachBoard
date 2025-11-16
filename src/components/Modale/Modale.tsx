import type { ModaleProps } from "@/components/Modale/types/modale.types.ts";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import "@css/Dialog.scss";

/**
 * Modale component
 * In order to trigger the modale, simply call the `useDialog` hook and use its `openDialog` method with the corresponding modale name.
 *
 * @description Choose a name for your modale instance.
 * Note that a name can correspond to only one modale instance and can have its own styles.
 *
 * @param children - Content the modale will observe (e.g., trigger button)
 * @param modaleContent - Content to be displayed inside the modal content area
 * @param modaleName - Name for your modale instance.
 * !! IMPORTANT !! NAME IS MANDATORY AND SHOULD BE UNIQUE ACROSS YOUR APPLICATION.
 * @param onOpenChange - Function to handle changes in the open state if needed
 */
export function Modale({
  children,
  modaleContent,
  modaleName,
  onOpenChange,
}: Readonly<ModaleProps>) {
  const { isDialogOpen, onOpenChange: contextOnOpenChange } = useDialog();
  const className = `dialog__content--${modaleName}`;
  const onOpenChangeHandler = onOpenChange ?? contextOnOpenChange;

  return (
    <Dialog
      open={isDialogOpen(modaleName)}
      onOpenChange={() => onOpenChangeHandler(modaleName)}
    >
      {children}
      <DialogContent className={className}>{modaleContent}</DialogContent>
    </Dialog>
  );
}
