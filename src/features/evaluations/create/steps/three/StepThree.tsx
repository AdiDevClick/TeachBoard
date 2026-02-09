import { useAppStore } from "@/api/store/AppStore.ts";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState.ts";
import {
  DescriptionChange,
  HandleLeftContentChange,
  ShowStudentsEvaluationWithPreviousArrow,
} from "@/features/evaluations/create/steps/three/components/step-three-functionnal-wrappers.functions";
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
import type { StepThreeSubskillsSelectionControllerProps } from "@/features/evaluations/create/steps/three/types/step-three.types.ts";
import {
  attendanceRecordCreationSchemaInstance,
  type AttendanceRecordCreationFormSchema,
  type AttendanceRecordCreationInputItem,
} from "@/features/evaluations/create/steps/two/models/attendance-record-creation.models";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  type Dispatch,
  type JSX,
  type SetStateAction,
} from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useOutletContext } from "react-router-dom";

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
  const [, setLeftContent] =
    useOutletContext<[JSX.Element, Dispatch<SetStateAction<JSX.Element>>]>();
  const user = useAppStore((state) => state.user);
  const {
    selectedClass,
    tasks,
    modules,
    moduleSelectionState,
    setShowStudentsEvaluation: displayModules,
    selectedSubSkill,
    evaluatedStudentsForThisSubskill,
  } = useStepThreeState();

  const form = useForm<AttendanceRecordCreationFormSchema & FieldValues>({
    resolver: zodResolver(attendanceRecordCreationSchemaInstance([])),
    mode: "onTouched",
    defaultValues: {
      students: [],
    },
  });

  const formId = pageId + "-form";
  const isModuleClicked = moduleSelectionState.isClicked;

  const card = useMemo(() => {
    if (!isModuleClicked) {
      return STEP_THREE_MODULE_SELECTION_CARD_PROPS;
    }

    return {
      ...STEP_THREE_SUBSKILLS_SELECTION_CARD_PROPS,
      title: {
        ...STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS,
        description: DescriptionChange(selectedSubSkill),
      },
    };
  }, [isModuleClicked, selectedSubSkill]);

  const baseCardProps = {
    pageId,
    modalMode,
    className,
    formId,
    inputControllers,
    card,
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

  /**
   * DISPATCH - Display students evaluation on module click
   *
   * @description This will update the context for left content on the parent component
   */
  const isModuleClickedTrigger = useEffectEvent(() => {
    if (!setLeftContent) return;

    const leftContent = HandleLeftContentChange(
      subskillsControllerProps,
      isModuleClicked,
    );

    setLeftContent(leftContent);
  });

  /**
   * CLEANUP - Reset left content
   *
   * @description This makes sure the subskills selection is empty on other pages than students evaluation
   */
  const onReturn = useEffectEvent(() => {
    setLeftContent(null!);
  });

  /**
   * DISPATCH -
   *
   * @description Each time a change occurs on module click
   */
  useEffect(() => {
    isModuleClickedTrigger();

    // CLEANUP
    return () => onReturn();
  }, [isModuleClicked]);

  return (
    <>
      {!isModuleClicked && <ShowModuleSelection {...moduleSelectionProps} />}
      {isModuleClicked && (
        <ShowStudentsEvaluationWithPreviousArrow
          {...studentsEvaluationProps}
          onPreviousArrowClick={displayModules}
        />
      )}
    </>
  );
}
