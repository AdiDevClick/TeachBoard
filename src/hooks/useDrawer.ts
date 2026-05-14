import { useDialog } from "@/hooks/contexts/useDialog";
import type { UseDrawerProps } from "@/hooks/types/use-drawer.types";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import { useEffect, useEffectEvent, type AnimationEvent } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Manage the state and routing of a drawer component.
 *
 * @description Use this hook for a navigational drawer. It will handle the opening of the drawer and wait for the close animation to end before navigating back to the previous route.
 *
 * @param pageId - The ID for the page/dialog, used for managing the state of the drawer in which the component using this hook is rendered.
 *
 * @returns An object containing the `waitAnimationAndNavigate` function to be called on the drawer's close animation end event.
 */
export function useDrawer({ pageId = "none" }: UseDrawerProps) {
  const { openDialog, isDialogOpen } = useDialog();
  const navigate = useNavigate();

  /**
   * Waits for the drawer close animation to end before navigating back to the previous route.
   *
   * @param e - The animation event triggered when the drawer's close animation ends.
   */
  const waitAnimationAndNavigate = (e: AnimationEvent<HTMLDivElement>) => {
    preventDefaultAndStopPropagation(e);

    if (!isDialogOpen(pageId)) {
      if (history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  /**
   * Open trigger
   *
   * @description !! IMPORTANT !! Adds an onClose callback to the dialog options to manipulate the local open state, which allows to wait for the close animation to end before navigating back.
   */
  const setupDrawer = useEffectEvent(() => {
    openDialog(null, pageId);
  });

  /**
   * Open the drawer
   *
   * @description When component mounts
   */
  useEffect(() => {
    setupDrawer();
  }, []);

  return { waitAnimationAndNavigate };
}
