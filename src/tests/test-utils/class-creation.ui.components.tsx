import type { CommandItemType } from "@/components/Command/types/command.types";
import { PopoverFieldWithCommands } from "@/components/Popovers/PopoverField";
import type { AppModalNames } from "@/configs/app.config";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { useForm } from "react-hook-form";

/**
 * Generic sample component to render a Popover/CommandList from an inputController.
 *
 * This mirrors the way pages like StepOne build inputs from `inputs-controllers.data.ts`.
 * It supports:
 * - opening (GET) via useCommandHandler.openingCallback
 * - cache-driven rendering via useCommandHandler.resultsCallback
 * - opening "add new" modals via useCommandHandler.newItemCallback
 */
export function SamplePopoverInput({
  pageId,
  controller,
  onSelect,
  options,
}: {
  readonly pageId: AppModalNames;
  // Intentionally loose typing: inputControllers are heterogeneous and already validated in app code.
  readonly controller: Record<string, unknown>;
  readonly onSelect?: (value: string, commandItem: CommandItemType) => void;
  readonly options?: Record<string, unknown>;
}) {
  const form = useForm({ defaultValues: {} });
  const { openingCallback, resultsCallback, newItemCallback } =
    useCommandHandler({
      // tests don't submit this form; we just need a RHF instance for the hook.
      form,
      pageId,
    });

  const handleAddNew = (args: Record<string, unknown>) => {
    if (args.task === "new-task-template") {
      args.selectedDiploma = options?.selectedDiploma ?? null;
    }
    newItemCallback(args);
  };

  return (
    <PopoverFieldWithCommands
      {...controller}
      commandHeadings={resultsCallback()}
      onOpenChange={openingCallback}
      onAddNewItem={handleAddNew}
      onSelect={onSelect}
    />
  );
}
