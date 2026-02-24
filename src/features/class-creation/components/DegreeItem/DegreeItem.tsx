import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  DEGREE_ITEM_CARD_TITLE,
  DEGREE_ITEM_FOOTER_PROPS,
} from "@/features/class-creation/components/DegreeItem/config/degree-item.configs";
import { DegreeItemController } from "@/features/class-creation/components/DegreeItem/controllers/DegreeItemController.tsx";
import {
  diplomaFieldData,
  type DegreeCreationFormSchema,
  type DegreeCreationInputItem,
} from "@/features/class-creation/components/DegreeItem/models/degree-creation.models";
import { degreeCreationInputControllersField } from "@/features/class-creation/index.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

/**
 * View component for creating a new degree item.
 *
 * @description This inits Zod validated form
 *
 * @param pageId - The ID of the page.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 * @param props - Additional props.
 */
function DegreeItem({
  pageId = "new-degree-item-field",
  inputControllers = degreeCreationInputControllersField,
  modalMode = true,
  className = "grid gap-4",
  ...props
}: Readonly<PageWithControllers<DegreeCreationInputItem>>) {
  const form = useForm<DegreeCreationFormSchema>({
    resolver: zodResolver(diplomaFieldData),
    mode: "onTouched",
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const formId = pageId + "-form";

  const commonProps = {
    pageId,
    inputControllers,
    formId,
    className,
    modalMode,
    card: {
      card: { className },
      title: DEGREE_ITEM_CARD_TITLE,
      footer: {
        ...DEGREE_ITEM_FOOTER_PROPS,
        formState: form.formState,
        formId,
      },
    },
    ...props,
    form,
  };

  return (
    <DegreeItemWithCard {...commonProps}>
      <DegreeItemWithCard.Title />
      <DegreeItemWithCard.Content />
      <DegreeItemWithCard.Footer />
    </DegreeItemWithCard>
  );
}

const DegreeItemWithCard = withTitledCard(DegreeItemController);
export default DegreeItem;
