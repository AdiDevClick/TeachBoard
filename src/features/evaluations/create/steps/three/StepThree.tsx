import { useAppStore } from "@/api/store/AppStore.ts";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState.ts";
import {
  ShowModuleSelection,
  ShowStudentsEvaluation,
} from "@/features/evaluations/create/steps/three/components/step-three-wrappers.functions.tsx";
import { STEP_THREE_MODULE_SELECTION_CARD_PROPS } from "@/features/evaluations/create/steps/three/config/step-three.configs.ts";
import { attendanceRecordCreationBaseControllers } from "@/features/evaluations/create/steps/three/forms/step-two-inputs.ts";
import {
  card,
  moduleCardAnimation,
} from "@/features/evaluations/create/steps/three/functions/step-three.functions";
import { useStepThree } from "@/features/evaluations/create/steps/three/hooks/useStepThree";
import {
  attendanceRecordCreationSchemaInstance,
  type AttendanceRecordCreationFormSchema,
  type AttendanceRecordCreationInputItem,
} from "@/features/evaluations/create/steps/two/models/attendance-record-creation.models";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { animation, cn } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, type AnimationEvent } from "react";
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

  const isModuleClicked = moduleSelectionState.isClicked;

  const { isModuleLoaded, setIsModuleLoaded } = useStepThree({
    isModuleClicked,
    setShowStudentsEvaluation,
  });

  const form = useForm<AttendanceRecordCreationFormSchema & FieldValues>({
    resolver: zodResolver(attendanceRecordCreationSchemaInstance([])),
    mode: "onTouched",
    defaultValues: {
      students: [],
    },
  });

  const baseCardProps = {
    pageId,
    modalMode,
    className,
    formId: pageId + "-form",
    inputControllers,
    card: card(selectedSubSkill, isModuleClicked),
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

  /**
   * ANIMATION END HANDLER -
   *
   * @description Makes sure to set the module as loaded to trigger the display of the students evaluation
   */
  const handleAnimationEnd = (e: AnimationEvent<HTMLElement>) => {
    if (e.animationName === "step-three-module-out") {
      setIsModuleLoaded(true);
    }
  };

  return (
    <>
      <ShowModuleSelection
        {...moduleSelectionProps}
        id="step-three-module"
        cardRender={{
          className: cn(moduleSelectionProps.card.card.className, "loading"),
          ...moduleCardAnimation(isModuleClicked, isModuleLoaded),
          onAnimationEnd: handleAnimationEnd,
        }}
      />
      <Activity mode={isModuleLoaded ? "visible" : "hidden"}>
        <ShowStudentsEvaluation
          {...studentsEvaluationProps}
          id="step-three-evaluation"
          cardRender={{
            ...animation(isModuleClicked, {
              incoming: { name: "step-three-evaluation-in" },
              outgoing: { name: "step-three-evaluation-out" },
            }),
          }}
        />
      </Activity>
    </>
  );
}
