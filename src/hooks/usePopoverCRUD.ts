import type {
  DynamicTagItemDetails,
  DynamicTagState,
} from "@/components/Tags/types/tags.types";
import type { UsePopoverCRUDProps } from "@/hooks/types/use-popover-CRUD.types.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { useState, type PointerEvent } from "react";
const defaultState: DynamicTagState = {
  selected: false,
  role: "",
  isEditing: false,
  isEdited: false,
  prevText: "",
  newText: "",
  selectedText: "",
  itemDetails: undefined,
};

/**
 * Custom hook to manage Popover CRUD state and actions.
 * @param props - The DynamicTagProps passed to the component.
 * @returns An object containing state and handler functions for Popover CRUD operations.
 */
export function usePopoverCRUD(props: UsePopoverCRUDProps) {
  const { onRemove } = props;
  const [state, setState] = useState<DynamicTagState>(defaultState);

  const handleOnDelete = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    const role = state.role;
    const details = state.itemDetails;

    // Try animate out locally before invoking onRemove
    const selector = `[data-role-id="${role}"]`;
    const el = document.querySelector(selector);

    if (el) {
      el.classList.remove("opened");
      el.classList.add("closed");

      let fired = false;
      const performDelete = () => {
        if (fired) return;
        fired = true;
        onRemove?.(role, details);
        setState(defaultState);
      };

      const animationDuration =
        globalThis.getComputedStyle(el).animationDuration;
      const hasAnimation = animationDuration
        .split(",")
        .some((duration) => Number.parseFloat(duration) > 0);

      if (!hasAnimation) {
        performDelete();
        return;
      }

      el.addEventListener("animationend", performDelete, { once: true });
    } else {
      // fallback
      onRemove?.(role, details);
      setState(defaultState);
    }
  };

  const handleOnEdit = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    const roleId = e.currentTarget.id.split("-")[0];
    const editable = document.getElementById(roleId);
    if (!editable) return;
    editable.focus();
    editable.dataset.isEditing = "true";
    editable.style.setProperty("user-select", "text");
    editable.style.setProperty("-webkit-user-modify", "read-write");
    const newRange = new Range();

    const selection = globalThis.getSelection();
    newRange.selectNodeContents(editable);

    selection?.focusNode;
    selection?.removeAllRanges();
    selection?.addRange(newRange);

    setState((prev) => ({
      ...prev,
      isEditing: true,
      prevText: roleId,
      selected: true,
      role: roleId,
    }));
  };

  const handleOnValidate = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    const role = e.currentTarget.id.split("-")[0];
    console.log("Validate role edit:", state.role);
    if (role === state.role) {
      // cleanup editable state on validate
      const editable = document.getElementById(role);
      if (editable) {
        // editable.removeAttribute("contenteditable");
        // editable.removeAttribute("data-is-editing");
        editable.removeAttribute("style");
        const selection = globalThis.getSelection();
        selection?.removeAllRanges();
      }
      setState(defaultState);
    }
  };

  const onRoleOpenChange = (
    open: boolean,
    role: string,
    details?: DynamicTagItemDetails,
  ) => {
    if (state.isEditing) return;
    console.log("openChange");
    setState(
      open
        ? {
            selected: true,
            role,
            isEditing: false,
            prevText: "",
            newText: "",
            selectedText: "",
            isEdited: false,
            itemDetails: details,
          }
        : defaultState,
    );
  };

  const handleOnTextEdited = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    const buttonEl = e.currentTarget;
    const newText = buttonEl.textContent ?? "";

    console.log(
      "Text edited for role:",
      buttonEl.id,
      "New text:",
      newText,
      state,
    );

    setState((prev) => ({
      ...prev,
      newText,
      isEdited: true,
      isEditing: false,
    }));

    // cleanup contenteditable & attributes
    buttonEl.removeAttribute("style");
    // buttonEl.removeAttribute("contenteditable");
    // buttonEl.removeAttribute("data-is-editing");
  };

  const handleFocus = (e: PointerEvent<HTMLButtonElement>) => {
    // preventDefaultAndStopPropagation(e);
    const editable = e.currentTarget;
    const roleId = editable.id;
    editable.focus();
    editable.dispatchEvent(new KeyboardEvent("keyup", { key: "arrowRight" }));
    editable.addEventListener(
      "keyup",
      (event) => {
        console.log(event);
        preventDefaultAndStopPropagation(event);
        if (event.key === "arrowRight" || event.key === "arrowLeft") {
          event.target.focus();
          const selection = window.getSelection();
          if (!selection) return;
          const range = document.createRange();
          range.selectNodeContents(editable);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      },
      { once: true },
    );
  };

  const handleOnCancel = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    setState((prev) => ({
      ...prev,
      isEditing: false,
      isEdited: false,
      newText: "",
      prevText: "",
    }));
  };

  // const handleOnTextEdited = (e: PointerEvent<HTMLButtonElement>) => {
  //   preventDefaultAndStopPropagation(e);
  //   const buttonEl = e.currentTarget;
  //   const newText = buttonEl.textContent ?? "";

  //   console.log(
  //     "Text edited for role:",
  //     buttonEl.id,
  //     "New text:",
  //     newText,
  //     state
  //   );

  //   setState((prev) => ({
  //     ...prev,
  //     newText,
  //     isEdited: true,
  //     isEditing: false,
  //   }));

  //   // cleanup contenteditable & attributes
  //   buttonEl.removeAttribute("style");
  //   // buttonEl.removeAttribute("contenteditable");
  //   // buttonEl.removeAttribute("data-is-editing");
  // };

  return {
    state,
    onRoleOpenChange,
    handleOnDelete,
    handleOnEdit,
    handleOnValidate,
    handleOnTextEdited,
    handleFocus,
    handleOnCancel,
  };
}
