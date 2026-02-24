import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { STEP_ONE_CARD_PROPS } from "@/features/evaluations/create/steps/one/config/step-one.configs.ts";
import { StepOneController } from "@/features/evaluations/create/steps/one/controller/StepOneController.tsx";
import { stepOneInputControllers } from "@/features/evaluations/create/steps/one/forms/step-one-inputs.ts";
import type { StepOneInputItem } from "@/features/evaluations/create/steps/one/models/step-one.models";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";

/**
 * Step One component for creating evaluations.
 *
 * @param pageId - The ID of the page.
 * @param className - Additional class names for the component.
 * @param modalMode - Whether the component is in modal mode.
 * @param inputControllers - The input controllers for the form.
 * @param props - Additional props.
 */
export function StepOne({
  pageId = "evaluation-class-selection",
  className = STEP_ONE_CARD_PROPS.card.className,
  modalMode = false,
  inputControllers = stepOneInputControllers,
  ...props
}: Readonly<PageWithControllers<StepOneInputItem>>) {
  const commonProps = {
    pageId,
    modalMode,
    className,
    inputControllers,
    card: STEP_ONE_CARD_PROPS,
    ...props,
  };

  return (
    <StepOneWithCard {...commonProps}>
      <StepOneWithCard.Content />
    </StepOneWithCard>
  );
}

const StepOneWithCard = withTitledCard(StepOneController);
