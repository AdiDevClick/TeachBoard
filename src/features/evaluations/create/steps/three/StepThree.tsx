import { useAppStore } from "@/api/store/AppStore.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState.ts";
import {
  ShowModuleSelection,
  ShowStudentsEvaluation,
} from "@/features/evaluations/create/steps/three/components/step-three-wrappers.functions.tsx";
import {
  STEP_THREE_MODULE_SELECTION_CARD_PROPS,
  STEP_THREE_SUBSKILLS_SELECTION_CARD_PROPS,
  STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS,
} from "@/features/evaluations/create/steps/three/config/step-three.configs.ts";
import { StepThreeSubskillsSelectionController } from "@/features/evaluations/create/steps/three/controllers/StepThreeSubskillsSelectionController.tsx";
import { attendanceRecordCreationBaseControllers } from "@/features/evaluations/create/steps/three/forms/step-two-inputs.ts";
import { handlePreviousClick } from "@/features/evaluations/create/steps/three/functions/step-three.functions.ts";
import type {
  ShowStudentsEvaluationWithPreviousArrowProps,
  StepThreeSubskillsSelectionControllerProps,
} from "@/features/evaluations/create/steps/three/types/step-three.types.ts";
import {
  attendanceRecordCreationSchemaInstance,
  type AttendanceRecordCreationFormSchema,
  type AttendanceRecordCreationInputItem,
} from "@/features/evaluations/create/steps/two/models/attendance-record-creation.models";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  useEffect,
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
  pageId = "attendance-record-creation",
  modalMode = false,
  className = "content__right",
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
        description: descriptionChange(selectedSubSkill),
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
   * Dispatch left content based on module selection state
   *
   * @description This will update the context for left content on the parent component
   */
  useEffect(() => {
    if (!setLeftContent) return;

    const leftContent = handleLeftContentChange(
      subskillsControllerProps,
      isModuleClicked,
    );

    setLeftContent(leftContent);

    // Cleanup function to reset left content when a step changed
    return () => {
      setLeftContent(null!);
    };
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

function ShowStudentsEvaluationWithPreviousArrow(
  props: ShowStudentsEvaluationWithPreviousArrowProps,
) {
  const { onPreviousArrowClick: displayModules, ...commonProps } = props;

  return (
    <>
      <IconArrowLeft
        className={
          STEP_THREE_MODULE_SELECTION_CARD_PROPS.card.className + " arrow-back"
        }
        onClick={(e) => handlePreviousClick(e, displayModules)}
        data-name="modules-previous"
      />
      <ShowStudentsEvaluation {...commonProps} />
    </>
  );
}

/**
 * Handle left content change based on module selection state
 *
 * @param commonProps - Common props for Step Three components
 * @param isModuleClicked - Whether the module selection is clicked
 *
 * @returns The left content JSX element
 */
function handleLeftContentChange(
  commonProps: StepThreeSubskillsSelectionControllerProps,
  isModuleClicked: boolean,
) {
  if (isModuleClicked) {
    return <StepThreeSubskillsSelectionController {...commonProps} />;
  }

  return null!;
}

/**
 * Change description based on selected sub-skill
 *
 * @param selectedSubSkill - The currently selected sub-skill.
 * @returns A JSX element representing the description.
 */
function descriptionChange(selectedSubSkill?: { name?: string } | null) {
  const { name } = selectedSubSkill || {};

  if (name) {
    return <Badge>{name}</Badge>;
  }

  return STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS.description;
}
