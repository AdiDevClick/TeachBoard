import { useAppStore } from "@/api/store/AppStore";
import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { PopoverFieldWithCommands } from "@/components/Popovers/PopoverField.tsx";
import {
  DEV_MODE,
  NO_CACHE_LOGS,
  NO_QUERY_LOGS,
} from "@/configs/app.config.ts";
import { stepOneInputControllers } from "@/data/inputs-controllers.data.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { HandleAddNewItemParams } from "@/hooks/database/types/use-command-handler.types.ts";
import type { StepOneControllerProps } from "@/pages/Evaluations/create/steps/one/types/step-one.types.ts";
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
      if (DEV_MODE && !NO_QUERY_LOGS) {
        console.debug("useQueryOnSubmit data", data ?? error);
      }
      // You can handle additional side effects here if needed
    }

    if (error) {
      // Errors are handled in onError callback
    }
  }, [data, error, isLoading]);

  /**
   * Handle adding a new item
   *
   * @param e - The event triggering the new item addition
   * @param rest - Additional parameters related to the new item
   */
  const handleNewItem = ({ e, ...rest }: HandleAddNewItemParams) => {
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Add new item triggered", {
        apiEndpoint: rest.apiEndpoint,
        task: rest.task,
      });
    }

    rest.userId = user?.userId;

    newItemCallback({
      e,
      ...rest,
    });
  };
  useEffect(() => {
    if (selectedClassName) {
      console.log("The selected parsed : ", selectedClassName);
    }
  }, [selectedClassName]);

  /**
   * Handle command selection from PopoverFieldWithControllerAndCommandsList
   *
   * @description Updates the selected diploma reference and selection state.
   *
   * @param value - The value of the selected command item
   * @param commandItem - The details of the selected command item
   */
  const handleOnSelect = (value: string, commandItem: CommandItemType) => {
    console.log("selected value :", value, commandItem);
    setSelectedClass(JSON.parse(JSON.stringify(commandItem)));
  };
  return (
    <PopoverFieldWithCommands
      {...stepOneInputControllers[0]}
      // form={form}
      // id={`${pageId}-year`}
      defaultValue={selectedClassName ?? stepOneInputControllers[0].placeholder}
      setRef={setRef}
      commandHeadings={resultsCallback()}
      observedRefs={observedRefs}
      onOpenChange={openingCallback}
      onSelect={handleOnSelect}
      onAddNewItem={handleNewItem}
    />
  );
}
