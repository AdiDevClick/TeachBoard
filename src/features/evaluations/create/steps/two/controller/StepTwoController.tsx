import { UUID_SCHEMA, type UUID } from "@/api/types/openapi/common.types.ts";
import type { InlineItemAndSwitchSelectionPayload } from "@/components/HOCs/types/with-inline-item-and-switch.types.ts";
import { InlineSwitchList } from "@/components/Selects/exports/vertical-field-select.exports";
import type { VerticalSelectMetaData } from "@/components/Selects/types/select.types.ts";
import {
  debugLogs,
  isStepTwoOnSelectPropsInvalid,
} from "@/configs/app-components.config";
import type { StepTwoControllerProps } from "@/features/evaluations/create/steps/two/types/step-two.types.ts";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import { useEffect, useEffectEvent, type MouseEvent } from "react";
import { useShallow } from "zustand/shallow";

export function StepTwoController({
  pageId,
  form,
  formId,
  className,
  inputControllers = [],
}: StepTwoControllerProps) {
  const preparedStudentsTasksSelection = useEvaluationStepsCreationStore(
    useShallow((state) => state.getStudentsPresenceSelectionData),
  )();

  const setStudentPresence = useEvaluationStepsCreationStore(
    (state) => state.setStudentPresence,
  );
  const setStudentTaskAssignment = useEvaluationStepsCreationStore(
    (state) => state.setStudentTaskAssignment,
  );

  const setAllNonPresentStudents = useEvaluationStepsCreationStore(
    (state) => state.setAllNonPresentStudents,
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
  const handleOpening = () => {};

  /**
   * Handle command selection from PopoverFieldWithControllerAndCommandsList
   *
   * @description Updates the selected diploma reference and selection state.
   *
   * @param taskId - The value of the selected command item
   * @param meta - The details of the selected student data
   */
  const handleOnSelect = (
    taskId: string | UUID,
    meta?: VerticalSelectMetaData,
  ) => {
    if (isStepTwoOnSelectPropsInvalid(meta)) {
      debugLogs(
        "[StepTwoController#handleOnSelect]: There is no ID in metadata, selection ignored.",
        { meta },
      );
      return;
    }
    const studentId = meta?.id;

    const parsedStudentId = UUID_SCHEMA.safeParse(studentId);
    const parsed = UUID_SCHEMA.safeParse(taskId);
    if (!parsedStudentId.success || !parsed.success) {
      debugLogs(
        "[StepTwoController#handleOnSelect]: Invalid student ID in metadata, selection ignored.",
        {
          studentId,
          error: parsedStudentId.error,
          taskId,
          taskError: parsed.error,
        },
      );
      return;
    }

    setStudentTaskAssignment(parsed.data, parsedStudentId.data);
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
    const parsed = UUID_SCHEMA.safeParse(studentData.id);
    if (!parsed.success) {
      debugLogs(
        "[StepTwoController#handleOnSwitch]: Invalid student ID in switch payload, selection ignored.",
        { studentId: studentData.id, error: parsed.error },
      );
      return;
    }

    setStudentPresence(parsed.data, studentData.isSelected);
  };

  /**
   * UNMOUNT - TRIGGER SAVE OF NON-PRESENT STUDENTS
   */
  const triggerPresenceCalculation = useEffectEvent(() => {
    setAllNonPresentStudents();
  });

  /**
   * UNMOUNT -
   *
   * @description Only once
   */
  useEffect(() => {
    return () => {
      // Prepare all non-present students for summary and validation in the next step
      triggerPresenceCalculation();
    };
  }, []);

  return (
    <form id={formId} className={className}>
      <InlineSwitchList
        items={preparedStudentsTasksSelection}
        setRef={setRef}
        observedRefs={observedRefs}
        control={form.control}
        {...inputControllers[0]}
        onOpenChange={handleOpening}
        onValueChange={handleOnSelect}
        onSwitchClick={handleOnSwitch}
      />
    </form>
  );
}
