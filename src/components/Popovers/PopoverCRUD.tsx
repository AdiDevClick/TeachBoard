import { Button } from "@/components/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import type { UsePopoverCRUDProps } from "@/hooks/types/use-popover-CRUD.types.ts";
import { usePopoverCRUD } from "@/hooks/usePopoverCRUD.ts";
import sanitizeDOMProps from "@/utils/props.ts";
import { PopoverArrow, PopoverClose } from "@radix-ui/react-popover";
import { CheckIcon, Pencil, RotateCcw, Trash2, XIcon } from "lucide-react";
import { type ComponentType } from "react";

/**
 * Higher-Order Component to wrap a component with Popover CRUD functionality.
 *
 * @param WrappedComponent The component to be wrapped.
 *
 * @returns A new component with Popover CRUD functionality.
 */
export function withPopoverCRUD<T extends object>(
  WrappedComponent: ComponentType<T>,
) {
  return function PopoverCRUDWrapper(props: Readonly<UsePopoverCRUDProps & T>) {
    const { value, itemDetails, ...rest } = props;
    const safeRest = sanitizeDOMProps(rest, ["onRemove"]);

    const {
      onRoleOpenChange,
      handleOnDelete,
      handleOnEdit,
      handleOnValidate,
      handleOnTextEdited,
      handleFocus,
      handleOnCancel,
      state,
    } = usePopoverCRUD(props);

    return (
      <Popover
        open={state.selected && state.role === value}
        onOpenChange={(open) =>
          onRoleOpenChange(open, value ?? "Default-PopoverCRUD", itemDetails)
        }
      >
        <PopoverTrigger asChild>
          <WrappedComponent {...(safeRest as T)} />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="center"
          sideOffset={8}
          className="p-0.5 w-auto max-h-min-content"
        >
          {state.isEditing && state.role === value ? (
            <>
              <DefaultButton
                variant="outline"
                id={value + "-validate"}
                onClick={handleOnValidate}
                aria-label={`Valider ${value}`}
              >
                <CheckIcon className="size-4" />
              </DefaultButton>
              <DefaultButton
                id={value + "-cancel"}
                onClick={handleOnCancel}
                aria-label={`Annuler ${value}`}
              >
                <RotateCcw className="size-4" />
              </DefaultButton>
            </>
          ) : (
            state.role === value && (
              <>
                <DefaultButton
                  onClick={handleOnEdit}
                  id={value + "-edit"}
                  aria-label={`Modifier ${value}`}
                >
                  <Pencil className="size-4" />
                </DefaultButton>
                <DefaultButton
                  onClick={handleOnDelete}
                  id={value + "-delete"}
                  aria-label={`Supprimer ${value}`}
                >
                  <Trash2 className="size-4" />
                </DefaultButton>
                <PopoverClose asChild>
                  <DefaultButton
                    id={value + "-close"}
                    aria-label={`Fermer ${value}`}
                  >
                    <XIcon className="size-4" />
                  </DefaultButton>
                </PopoverClose>
              </>
            )
          )}
          <PopoverArrow className="fill-popover" />
        </PopoverContent>
      </Popover>
    );
  };
}

function DefaultButton(props) {
  return <Button size="sm" variant="ghost" {...props} />;
}
