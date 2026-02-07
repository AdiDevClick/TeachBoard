import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { InlineItemAndSwitchSelectionPayload } from "@/components/HOCs/types/with-inline-item-and-switch.types.ts";
import type { MetaDatasPopoverField } from "@/components/Popovers/types/popover.types.ts";
import { VerticalFieldWithInlineSwitchList } from "@/components/Selects/exports/vertical-field-select.exports";
import type { VerticalSelectMetaData } from "@/components/Selects/types/select.types.ts";
import type { StepTwoControllerProps } from "@/features/evaluations/create/steps/two/types/step-two.types.ts";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import { type MouseEvent } from "react";

export function StepTwoController({
  pageId,
  form,
  formId,
  className,
  inputControllers = [],
  user,
  preparedStudentsTasksSelection,
  students,
  selectedClass,
  tasks,
}: StepTwoControllerProps) {
  // Placeholder form, replace 'any' with actual form schema
  // const [selected, setSelected] = useState(false);

  // const { onSubmit, isLoading, isLoaded, data, error, setFetchParams } =
  // useFetch();
  const setStudentPresence = useEvaluationStepsCreationStore(
    (state) => state.setStudentPresence,
  );
  const setStudentTaskAssignment = useEvaluationStepsCreationStore(
    (state) => state.setStudentTaskAssignment,
  );

  const { setRef, observedRefs } = useCommandHandler({
    form,
    pageId,
  });

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, fetch data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (open: boolean, metaData?: MetaDatasPopoverField) => {
    console.log("Opening :", open, metaData);
    // openingCallback(open, metaData);
  };

  /**
   * Handle command selection from PopoverFieldWithControllerAndCommandsList
   *
   * @description Updates the selected diploma reference and selection state.
   *
   * @param id - The value of the selected command item
   * @param studentData - The details of the selected student data
   */
  const handleOnSelect = (taskId: UUID, meta?: VerticalSelectMetaData) => {
    const studentId = meta?.id;
    if (!studentId) return;

    setStudentTaskAssignment(taskId, studentId);
  };

  /**
   * Handle switch click from VerticalFieldWithInlineSwitchList
   *
   * @description Updates the selected diploma reference and selection state.
   *
   * @param e - The mouse event triggered by the switch click
   * @param studentData - The details of the selected student data
   */
  const handleOnSwitch = (
    e: MouseEvent<HTMLButtonElement>,
    studentData: InlineItemAndSwitchSelectionPayload,
  ) => {
    preventDefaultAndStopPropagation(e);
    setStudentPresence(studentData.id, studentData.isSelected);
  };

  // Avoid passing a raw `id: string | undefined` from controllers because the
  // select component expects a branded `UUID` type; exclude `id` when spreading.
  const firstInputController = inputControllers[0];
  const { id, ...firstInputControllerProps } = firstInputController ?? {};

  return (
    <form id={formId} className={className}>
      <VerticalFieldWithInlineSwitchList
        items={preparedStudentsTasksSelection}
        setRef={setRef}
        observedRefs={observedRefs}
        form={form}
        {...inputControllers[0]}
        onOpenChange={handleOpening}
        onValueChange={handleOnSelect}
        onSwitchClick={handleOnSwitch}
      />
    </form>
  );
}
