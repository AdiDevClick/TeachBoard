import { useAppStore } from "@/api/store/AppStore";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { PopoverFieldWithCommands } from "@/components/Popovers/exports/popover-field.exports";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { debugLogs } from "@/configs/app-components.config";
import { stepOneInputControllers } from "@/features/evaluations/create/steps/one/forms/step-one-inputs.ts";
import type { StepOneControllerProps } from "@/features/evaluations/create/steps/one/types/step-one.types.ts";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { saveFetchResultInCache } from "@/hooks/database/fetches/functions/use-fetch.functions";
import type { HandleAddNewItemParams } from "@/hooks/database/types/use-command-handler.types.ts";
import { parseFromObject } from "@/utils/utils";
import { useEffect } from "react";
import { toast } from "sonner";

const loadingName = "load-classes";

/**
 * Step One Controller component for creating evaluations.
 *
 * @param pageId - The ID of the page.
 */
export function StepOneController({ pageId }: StepOneControllerProps) {
  const user = useAppStore((state) => state.user);
  const setSelectedClass = useEvaluationStepsCreationStore(
    (state) => state.setSelectedClass,
  );
  const selectedClassName = useEvaluationStepsCreationStore(
    (state) => state.className,
  );

  const {
    setRef,
    observedRefs,
    newItemCallback,
    openingCallback,
    resultsCallback,
    isLoading,
    data,
    error,
    queryClient,
  } = useCommandHandler({
    form: null!,
    pageId,
  });

  useEffect(() => {
    if (isLoading) {
      toast.loading("Chargement des classes...", { id: loadingName });
    }

    if (data || error) {
      toast.dismiss(loadingName);
    }
  }, [data, error, isLoading]);

  /**
   * Handle adding a new item
   *
   * @param e - The event triggering the new item addition
   * @param rest - Additional parameters related to the new item
   */
  const handleNewItem = ({ e, ...rest }: HandleAddNewItemParams) => {
    debugLogs("StepOneController:handleNewItem", {
      type: "cacheLogs",
      apiEndpoint: rest.apiEndpoint,
      task: rest.task,
    });

    rest.userId = user?.userId;

    newItemCallback({
      e,
      ...rest,
    });
  };

  /**
   * Handle command selection from PopoverFieldWithControllerAndCommandsList
   *
   * @description Updates the selected diploma reference and selection state.
   *
   * @param value - The value of the selected command item
   * @param commandItem - The details of the selected command item
   */
  const handleOnSelect = (_value: string, commandItem: CommandItemType) => {
    const parsed = parseFromObject(commandItem);
    if (parsed === null) return;

    // Save the fetched class data in the cache for later use and to avoid refetching when navigating to the evaluation overview page, as we already have the necessary data at hand.
    saveFetchResultInCache(
      queryClient,
      "evaluation-class-selection",
      API_ENDPOINTS.GET.CLASSES.endPoints.BY_ID(parsed.id),
      API_ENDPOINTS.GET.CLASSES.dataReshapeSingle,
      parsed,
    );

    setSelectedClass(parsed as unknown as ClassSummaryDto);
  };

  return (
    <PopoverFieldWithCommands
      {...stepOneInputControllers[0]}
      defaultValue={selectedClassName ?? stepOneInputControllers[0].placeholder}
      setRef={setRef}
      commandHeadings={resultsCallback()}
      observedRefs={observedRefs}
      onOpenChange={openingCallback}
      onSelect={handleOnSelect}
      onClick={handleNewItem}
    />
  );
}
