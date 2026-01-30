import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { stepOneInputControllers } from "@/data/inputs-controllers.data.ts";
import type { StepOneInputItem } from "@/models/step-one.models.ts";
import { STEP_ONE_CARD_PROPS } from "@/pages/Evaluations/create/steps/one/config/step-one.configs.ts";
import { StepOneController } from "@/pages/Evaluations/create/steps/one/controller/StepOneController.tsx";
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
  pageId = "evaluation-step-one",
  className = STEP_ONE_CARD_PROPS.card.className || "content__right",
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
      <StepOneWithCard.Title />
      <StepOneWithCard.Content />
    </StepOneWithCard>
  );
}

const StepOneWithCard = withTitledCard(StepOneController);
