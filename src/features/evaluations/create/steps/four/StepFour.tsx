import { useAppStore } from "@/api/store/AppStore.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import { rightContent } from "@/assets/css/EvaluationPage.module.scss";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { useStepFourState } from "@/features/evaluations/create/hooks/useStepFourState";
import {
  STEP_FOUR_CARD_PROPS,
  STEP_FOUR_INPUT_CONTROLLERS,
} from "@/features/evaluations/create/steps/four/config/step-four.configs.ts";
import { StepFourController } from "@/features/evaluations/create/steps/four/controller/StepFourController.tsx";
import {
  stepFourInputSchema,
  type StepFourFormSchema,
} from "@/features/evaluations/create/steps/four/models/step-four.models";
import type { StepFourProps } from "@/features/evaluations/create/steps/four/types/step-four.types";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import type { ClassModules } from "@/features/evaluations/create/store/types/steps-creation-store.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useEffectEvent, type ComponentProps } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";

/**
 * STEP FOUR - Summary and Confirmation Component
 *
 * @description This component is wrapped with a titled card layout using the `withTitledCard` HOC.
 *
 * @param pageId - The ID of the page.
 * @param modalMode - Whether the component is in modal mode.
 * @param className - Additional class names for the component.
 * @param inputControllers - The input controllers for the form.
 * @param props - Additional props.
 *
 * @returns The Step Four component wrapped in a titled card.
 */
export function StepFour({
  pageId = "evaluation-summary",
  modalMode = false,
  className = rightContent,
  inputControllers = STEP_FOUR_INPUT_CONTROLLERS,
  ...props
}: StepFourProps) {
  const { evaluationId } = useParams();
  const mode = useLoaderData().mode;
  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();
  const { selectedClass, modules, title, comments } = useStepFourState();
  const evaluationDate = useEvaluationStepsCreationStore(
    (state) => state.evaluationDate,
  );

  const foundTitle =
    title ?? "Evaluation du " + STEP_FOUR_CARD_PROPS.title.description;

  const form = useForm<StepFourFormSchema>({
    resolver: zodResolver(stepFourInputSchema),
    mode: "onTouched",
    defaultValues: {
      userId: user?.userId,
      title: foundTitle,
      evaluations: [],
      overallScore: {},
      absence: ["none"],
      comments: comments ?? "",
      evaluationDate: evaluationDate ?? new Date().toISOString(),
    },
  });

  const { isSubmitSuccessful } = useFormState({
    control: form.control,
  });

  const triggerNavigationGuard = useEffectEvent(
    (modules: ClassModules[], selectedClass?: ClassSummaryDto | null) => {
      if (!selectedClass || modules.length === 0) {
        navigate("/evaluations/create");
      }
    },
  );

  /**
   * INIT - REDIRECT IF NO CLASS OR NO ATTENDED MODULES
   */
  useEffect(() => {
    if (isSubmitSuccessful) {
      return;
    }

    triggerNavigationGuard(modules, selectedClass);
  }, [isSubmitSuccessful, modules, selectedClass]);

  const endpoint =
    mode === "create"
      ? API_ENDPOINTS.POST.CREATE_EVALUATION.endpoint
      : API_ENDPOINTS.PUT.UPDATE_EVALUATION.endpoint(evaluationId as string);

  const baseCardProps = {
    pageId,
    modalMode,
    className,
    formId: pageId + "-form",
    inputControllers,
    card: STEP_FOUR_CARD_PROPS,
    ...props,
    form,
    submitRoute: endpoint,
    submitDataReshapeFn: API_ENDPOINTS.POST.CREATE_EVALUATION.dataReshape,
  } satisfies ComponentProps<typeof ShowSummary>;

  return <ShowSummary {...baseCardProps} />;
}

/**
 * Convenient function to show students evaluation component
 */
function ShowSummary(commonProps: ComponentProps<typeof Summary>) {
  const { isValid, isSubmitting, isSubmitSuccessful } = useFormState({
    control: commonProps.form.control,
  });
  const isDisabledCondition = isSubmitSuccessful || isSubmitting || !isValid;
  const formId = commonProps.formId;

  return (
    <Summary {...commonProps}>
      <Summary.Title />
      <Summary.Content />
      <Summary.Footer>
        <Button
          variant="outline"
          className="mx-auto mr-6"
          type="submit"
          disabled={isDisabledCondition}
          form={formId}
        >
          {"Enregistrer"}
        </Button>
      </Summary.Footer>
    </Summary>
  );
}

const Summary = withTitledCard(StepFourController);
