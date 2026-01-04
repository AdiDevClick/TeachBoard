import withController from "@/components/HOCs/withController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import type {
  DynamicTagItemDetails,
  DynamicTagProps,
  DynamicTagState,
} from "@/components/Tags/types.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { PopoverArrow, PopoverClose } from "@radix-ui/react-popover";
import { CheckIcon, Pencil, RotateCcw, Trash2, XIcon } from "lucide-react";
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

export function DynamicTag(props: Readonly<DynamicTagProps>) {
  const [state, setState] = useState<DynamicTagState>(defaultState);

  const { pageId, onRemove, itemList, title, ...rest } = props;
  const scopedPageId = pageId ?? "dynamic-tag";

  const handleOnDelete = (e: PointerEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    console.log("Delete role:", state.role);
    console.log("The rest : ", rest);
    console.log("all the props : ", props);
    onRemove?.(state.role, state.itemDetails);
    setState(defaultState);
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
    details?: DynamicTagItemDetails
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
        : defaultState
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
      state
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
      { once: true }
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

  return (
    <ItemGroup id={`${scopedPageId}-roles`} className="grid gap-2">
      <ItemTitle>{title}</ItemTitle>
      <Item variant={"default"} className="p-0">
        <ItemContent className="flex-row flex-wrap gap-2">
          <ListMapper items={itemList}>
            {([value, itemDetails]) => {
              const valueStr = String(value);
              return (
                <ItemActions key={valueStr} className="relative">
                  <Popover
                    open={state.selected && state.role === valueStr}
                    onOpenChange={(open) =>
                      onRoleOpenChange(open, valueStr, itemDetails)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        // onBlur={handleOnTextEdited}
                        // onFocus={handleOnTextEdit}
                        // onClick={handleFocus}
                        data-is-editing={
                          state.isEditing && state.role === valueStr
                        }
                        id={valueStr}
                        size="sm"
                        variant="outline"
                        contentEditable={
                          state.isEditing && state.role === valueStr
                        }
                      >
                        {valueStr}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      align="center"
                      sideOffset={8}
                      className="p-0.5 w-auto max-h-min-content"
                    >
                      {state.isEditing && state.role === value ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            id={valueStr + "-validate"}
                            onClick={handleOnValidate}
                            aria-label={`Valider ${valueStr}`}
                          >
                            <CheckIcon className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            id={valueStr + "-cancel"}
                            onClick={handleOnCancel}
                            aria-label={`Annuler ${valueStr}`}
                          >
                            <RotateCcw className="size-4" />
                          </Button>
                        </>
                      ) : (
                        state.role === valueStr && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleOnEdit}
                              id={valueStr + "-edit"}
                              aria-label={`Modifier ${valueStr}`}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleOnDelete}
                              id={valueStr + "-delete"}
                              aria-label={`Supprimer ${valueStr}`}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                            <PopoverClose asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                id={value + "-close"}
                                aria-label={`Fermer ${value}`}
                              >
                                <XIcon className="size-4" />
                              </Button>
                            </PopoverClose>
                          </>
                        )
                      )}
                      <PopoverArrow className="fill-popover" />
                    </PopoverContent>
                  </Popover>
                </ItemActions>
              );
            }}
          </ListMapper>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}

export const ControlledDynamicTagList = withController(DynamicTag);
