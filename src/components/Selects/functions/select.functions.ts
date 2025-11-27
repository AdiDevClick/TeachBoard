import type { HandleAddNewParams } from "@/components/Selects/types/select.types.ts";
import { preventDefaultAndStopPropagation, wait } from "@/utils/utils.ts";

/**
 * Prevents the button text from being selected and opens a dialog if provided.
 *
 * @description A trick is used here by awaiting a short time before resetting the selected state.
 *
 * @param e - The pointer event triggered on adding a new item.
 * @param setSelected - State dispatcher to manage the selected state.
 */
export async function preventButtonToBeSelected({
  e,
  setSelected,
}: HandleAddNewParams) {
  preventDefaultAndStopPropagation(e);

  setSelected(true);
  await wait(150);
  setSelected(false);
}
