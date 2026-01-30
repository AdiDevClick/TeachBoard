import { useAppStore } from "@/api/store/AppStore";
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
  const userId = useAppStore((s) => s.user?.userId);
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

    if (args.task === "class-creation" && typeof userId === "string") {
      args.userId = userId;
    }

    newItemCallback(args);
  };

  // Resolve dynamic apiEndpoint functions when we have enough context (e.g. selected diploma)
  const selectedDiploma = (options?.selectedDiploma ?? null) as {
    id?: string;
  } | null;

  const resolvedController = {
    ...controller,
    apiEndpoint:
      typeof controller.apiEndpoint === "function" && selectedDiploma?.id
        ? (controller.apiEndpoint as (id: string) => unknown)(
            selectedDiploma.id
          )
        : controller.apiEndpoint,
  };

  return (
    <PopoverFieldWithCommands
      {...(resolvedController as Record<string, unknown>)}
      commandHeadings={resultsCallback()}
      onOpenChange={openingCallback}
      onAddNewItem={handleAddNew}
      onSelect={onSelect}
    />
  );
}
