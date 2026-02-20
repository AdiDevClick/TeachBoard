import { useAppStore } from "@/api/store/AppStore.ts";
import { rightContent } from "@/assets/css/EvaluationPage.module.scss";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { type ComponentProps } from "react";
import { useForm, useFormState } from "react-hook-form";

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
  const user = useAppStore((state) => state.user);

  const form = useForm<StepFourFormSchema>({
    resolver: zodResolver(stepFourInputSchema),
    mode: "onTouched",
    defaultValues: {
      userId: user?.userId,
      title: "Evaluation du " + STEP_FOUR_CARD_PROPS.title.description,
      evaluations: [],
      overallScore: {},
      absence: ["none"],
      comments: "",
      evaluationDate: new Date().toISOString(),
    },
  });

  const baseCardProps = {
    pageId,
    modalMode,
    className,
    formId: pageId + "-form",
    inputControllers,
    card: STEP_FOUR_CARD_PROPS,
    ...props,
    form,
    submitRoute: API_ENDPOINTS.POST.CREATE_EVALUATION.endpoint,
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
