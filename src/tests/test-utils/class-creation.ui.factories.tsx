import type {
  CommandItemType,
  CommandsProps,
} from "@/components/Command/types/command.types";
import { PopoverFieldWithCommands } from "@/components/Popovers/PopoverField";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { useEffect } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type InputControllerLike = {
  id?: string;
  name?: string;
  task?: string;
  label?: string;
  title?: string;
  placeholder?: string;
  apiEndpoint?: unknown;
  dataReshapeFn?: unknown;
  useCommands?: boolean;
  useButtonAddNew?: boolean;
  creationButtonText?: string | false;
};

export function controllerLabel(controller: InputControllerLike): string {
  return String(controller.label ?? controller.title ?? "");
}

export function controllerTriggerText(controller: InputControllerLike): string {
  const raw = String(
    controller.placeholder ?? controller.label ?? controller.title ?? ""
  ).trim();

  // Avoid brittle matching on ellipsis differences ("..." vs "…").
  return raw.replace(/[.…]+$/u, "").trim();
}

export function controllerTriggerRegex(
  controller: InputControllerLike
): RegExp {
  const text = controllerTriggerText(controller);
  if (!text) return /.+/i;
  return new RegExp(escapeRegExp(text), "i");
}

export function controllerLabelRegex(controller: InputControllerLike): RegExp {
  const text = controllerLabel(controller);
  if (!text) return /.+/i;
  return new RegExp(escapeRegExp(text), "i");
}

export function createCommandPopoverSample<
  TForm extends FieldValues = FieldValues
>(options: {
  pageId: string;
  controller: InputControllerLike;
  prefetchController?: InputControllerLike;
  formDefaultValues?: Partial<TForm>;
  onSelect?: CommandsProps["onSelect"];
  mapAddNewPayload?: (payload: unknown) => unknown;
}) {
  const {
    pageId,
    controller,
    prefetchController = controller,
    formDefaultValues,
    onSelect,
    mapAddNewPayload,
  } = options;

  function Sample() {
    const form = useForm<TForm>({
      defaultValues: (formDefaultValues ?? {}) as TForm,
    });

    const { openingCallback, resultsCallback, newItemCallback } =
      useCommandHandler({
        form,
        pageId,
      });

    useEffect(() => {
      openingCallback(true, prefetchController as never);
    }, [openingCallback]);

    const handleAddNew: CommandsProps["onAddNewItem"] = (payload) => {
      newItemCallback(
        (mapAddNewPayload ? mapAddNewPayload(payload) : payload) as never
      );
    };

    return (
      <PopoverFieldWithCommands
        {...(controller as Record<string, unknown>)}
        commandHeadings={resultsCallback()}
        onOpenChange={openingCallback}
        onAddNewItem={handleAddNew}
        onSelect={onSelect as (value: string, item: CommandItemType) => void}
      />
    );
  }

  return Sample;
}
