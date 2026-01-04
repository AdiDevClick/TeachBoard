import { DegreeItemController } from "@/components/ClassCreation/diploma/degree-item/controller/DegreeItemController.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { degreeCreationInputControllersField } from "@/data/inputs-controllers.data.ts";
import {
  diplomaFieldData,
  type DegreeCreationFormSchema,
  type DegreeCreationInputItem,
} from "@/models/degree-creation.models.ts";
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
 * @param modalMode - Whether the component is in modal mode.
 * @param props - Additional props.
 */
function DegreeItem({
  pageId = "new-degree-item-field",
  modalMode = true,
  inputControllers = degreeCreationInputControllersField,
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

  const commonProps = useMemo(
    () => ({
      pageId,
      inputControllers,
      formId,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      modalMode,
      titleProps,
      ...props,
      form,
    }),
    [form.formState, props]
  );

  return <DegreeItemWithCard {...commonProps} />;
}

const DegreeItemWithCard = withTitledCard(DegreeItemController);
export default DegreeItem;
