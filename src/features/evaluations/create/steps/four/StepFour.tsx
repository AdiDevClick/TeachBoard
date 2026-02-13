import { useAppStore } from "@/api/store/AppStore.ts";
import { rightContent } from "@/assets/css/EvaluationPage.module.scss";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { Button } from "@/components/ui/button";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState.ts";
import {
  STEP_FOUR_CARD_PROPS,
  STEP_FOUR_INPUT_CONTROLLERS,
} from "@/features/evaluations/create/steps/four/config/step-four.configs.ts";
import { StepFourController } from "@/features/evaluations/create/steps/four/controller/StepFourController.tsx";
import {
  type StepFourSchema,
  stepFourInputSchema,
} from "@/features/evaluations/create/steps/four/models/step-four.models";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ComponentProps,
  type Dispatch,
  type JSX,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useOutletContext } from "react-router-dom";

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
}: Readonly<PageWithControllers<typeof STEP_FOUR_INPUT_CONTROLLERS>>) {
  const loaderData = useLoaderData();
  useOutletContext<[JSX.Element, Dispatch<SetStateAction<ReactNode>>]>();
  const user = useAppStore((state) => state.user);

  const form = useForm<StepFourSchema>({
    resolver: zodResolver(stepFourInputSchema),
    mode: "onTouched",
    defaultValues: {
      userId: user?.userId,
      title: loaderData.pageTitle,
      evaluations: [],
      overallScore: 0,
      absence: ["none"],
      comments: "",
      evaluationDate: new Date().toISOString(),
    },
  });

  const baseCardProps = {
    user: user?.userId,
    pageId,
    modalMode,
    className,
    formId: pageId + "-form",
    inputControllers,
    card: STEP_FOUR_CARD_PROPS,
    ...props,
    form,
  };

  return <ShowSummary {...baseCardProps} />;
}

/**
 * Convenient function to show students evaluation component
 */
function ShowSummary(commonProps: ComponentProps<typeof Summary>) {
  const formId = commonProps.formId;
  const isValid = commonProps.form?.formState?.isValid;
  return (
    <Summary {...commonProps}>
      <Summary.Title />
      <Summary.Content />
      <Summary.Footer>
        <Button
          variant="outline"
          className="mx-auto mr-6"
          type="submit"
          disabled={!isValid}
          form={formId}
        >
          {"Enregistrer"}
        </Button>
      </Summary.Footer>
    </Summary>
  );
}

const Summary = withTitledCard(StepFourController);
