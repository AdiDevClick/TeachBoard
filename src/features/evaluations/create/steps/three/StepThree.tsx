import { useAppStore } from "@/api/store/AppStore.ts";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState.ts";
import { DescriptionChange } from "@/features/evaluations/create/steps/three/components/step-three-functionnal-wrappers.functions";
import {
  ShowModuleSelection,
  ShowStudentsEvaluation,
} from "@/features/evaluations/create/steps/three/components/step-three-wrappers.functions.tsx";
import {
  STEP_THREE_MODULE_SELECTION_CARD_PROPS,
  STEP_THREE_SUBSKILLS_SELECTION_CARD_PROPS,
  STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS,
} from "@/features/evaluations/create/steps/three/config/step-three.configs.ts";
import { attendanceRecordCreationBaseControllers } from "@/features/evaluations/create/steps/three/forms/step-two-inputs.ts";
import { useStepThree } from "@/features/evaluations/create/steps/three/hooks/useStepThree";
import type { StepThreeSubskillsSelectionControllerProps } from "@/features/evaluations/create/steps/three/types/step-three.types.ts";
import {
  attendanceRecordCreationSchemaInstance,
  type AttendanceRecordCreationFormSchema,
  type AttendanceRecordCreationInputItem,
} from "@/features/evaluations/create/steps/two/models/attendance-record-creation.models";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues } from "react-hook-form";

/**
 * STEP THREE - Evaluation
 *
 * @description This component is wrapped with a titled card layout using the `withTitledCard` HOC.
 *
 * @param pageId - The ID of the page.
 * @param modalMode - Whether the component is in modal mode.
 * @param className - Additional class names for the component.
 * @param inputControllers - The input controllers for the form.
 * @param props - Additional props.
 *
 * @returns The Step Three component wrapped in a titled card.
 */
export function StepThree({
  pageId = "evaluation-module-selection",
  modalMode = false,
  className = STEP_THREE_MODULE_SELECTION_CARD_PROPS.card.className,
  inputControllers = attendanceRecordCreationBaseControllers,
  ...props
}: Readonly<PageWithControllers<AttendanceRecordCreationInputItem>>) {
  const user = useAppStore((state) => state.user);
  const {
    selectedClass,
    tasks,
    modules,
    moduleSelectionState,
    selectedSubSkill,
    evaluatedStudentsForThisSubskill,
    setShowStudentsEvaluation,
  } = useStepThreeState();

  const form = useForm<AttendanceRecordCreationFormSchema & FieldValues>({
    resolver: zodResolver(attendanceRecordCreationSchemaInstance([])),
    mode: "onTouched",
    defaultValues: {
      students: [],
    },
  });

  const isModuleClicked = moduleSelectionState.isClicked;

  const card = () => {
    if (!isModuleClicked) {
      return STEP_THREE_MODULE_SELECTION_CARD_PROPS;
    }

    return {
      ...STEP_THREE_SUBSKILLS_SELECTION_CARD_PROPS,
      title: {
        ...STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS,
        description: DescriptionChange(selectedSubSkill ?? {}),
      },
    };
  };

  const baseCardProps = {
    pageId,
    modalMode,
    className,
    formId: pageId + "-form",
    inputControllers,
    card: card(),
    ...props,
    form,
  };

  const moduleSelectionProps = {
    ...baseCardProps,
    modules,
  } satisfies Parameters<typeof ShowModuleSelection>[0];

  const studentsEvaluationProps = {
    ...baseCardProps,
    user,
    students: evaluatedStudentsForThisSubskill,
    modules,
    selectedClass: selectedClass ?? null,
    tasks,
  } satisfies Parameters<typeof ShowStudentsEvaluation>[0];

  const subskillsControllerProps = {
    ...baseCardProps,
    user,
  } satisfies StepThreeSubskillsSelectionControllerProps;

  useStepThree({
    subskillsControllerProps,
    isModuleClicked,
    setShowStudentsEvaluation,
  });

  return (
    <>
      {!isModuleClicked && <ShowModuleSelection {...moduleSelectionProps} />}
      {isModuleClicked && (
        <ShowStudentsEvaluation {...studentsEvaluationProps} />
      )}
    </>
  );
}
