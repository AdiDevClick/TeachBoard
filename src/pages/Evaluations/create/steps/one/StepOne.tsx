import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { stepOneInputControllers } from "@/data/inputs-controllers.data.ts";
import type { StepOneInputItem } from "@/models/step-one.models.ts";
import { StepOneController } from "@/pages/Evaluations/create/steps/one/controller/StepOneController.tsx";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
export const stepOneTitleProps = {
  // title: "Liste d'élèves",
  // description: "Définir les élèves présents ainsi que leurs fonctions.",
  className: "hidden",
};

export const stepOneCardProps = {
  card: { className: "content__right" },
  content: {
    className: "right__content-container",
  },
};

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
  pageId,
  className = "content__right",
  modalMode = false,
  inputControllers = stepOneInputControllers,
  ...props
}: Readonly<PageWithControllers<StepOneInputItem>>) {
  const commonProps = {
    pageId,
    modalMode,
    className,
    inputControllers,
    titleProps: stepOneTitleProps,
    cardProps: stepOneCardProps,
    ...props,
  };

  return <StepOneWithCard displayFooter={false} {...commonProps} />;
}

const StepOneWithCard = withTitledCard(StepOneController);
