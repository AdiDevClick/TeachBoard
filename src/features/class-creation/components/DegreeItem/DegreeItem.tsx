import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { DegreeItemController } from "@/features/class-creation/components/DegreeItem/controllers/DegreeItemController.tsx";
import {
  diplomaFieldData,
  type DegreeCreationFormSchema,
  type DegreeCreationInputItem,
} from "@/features/class-creation/components/DegreeItem/models/degree-creation.models";
import { degreeCreationInputControllersField } from "@/features/class-creation/index.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Création d'un nouveau domaine / métier",
  description: "Ajoutez un nouveau domaine / métier pour les diplômes.",
};

const footerProps = { submitText: "Créer", cancelText: "Annuler" };

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

  const narrowedPageId = pageId as
    | "new-degree-item-field"
    | "new-degree-item-year"
    | "new-degree-item-degree";

  const formId = narrowedPageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId: narrowedPageId,
      inputControllers,
      formId,
      className,
      modalMode,
      card: {
        card: { className },
        title: titleProps,
        footer: {
          ...footerProps,
          formState: form.formState,
          formId,
        },
      },
      ...props,
      form,
    }),
    [form.formState, props],
  );

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
