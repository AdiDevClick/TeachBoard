import { DegreeSkillController } from "@/components/ClassCreation/diploma/degree-skill/controller/DegreeSkillController.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { degreeCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useDegreeCreationForm } from "@/hooks/database/classes/useDegreeCreationForm.ts";
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
  title: "Création de nouveaux modules de compétences",
  description: "Ces modules pourront être associés aux diplômes.",
};

const footerProps = { submitText: "Ajouter", cancelText: "Annuler" };

/**
 * View component for creating a new degree skill.
 *
 * @description This inits Zod validated form
 *
 * @param pageId - The ID of the page.
 * @param formId - The ID of the form.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 * @param modalMode - Whether the component is in modal mode.
 * @param props - Additional props.
 */
function DegreeSkill({
  pageId = "new-degree-item",
  modalMode = true,
  inputControllers = degreeCreationInputControllers,
  ...props
}: Readonly<PageWithControllers<DegreeCreationInputItem>>) {
  const formId = pageId + "-form";

  const queryHooks = useDegreeCreationForm("LEVEL");

  const form = useForm<DegreeCreationFormSchema>({
    resolver: zodResolver(diplomaFieldData),
    mode: "onTouched",
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const commonProps = useMemo(
    () => ({
      pageId,
      inputControllers,
      formId,
      form,
      modalMode,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId: formId,
      },
      titleProps,
      queryHooks,
      ...props,
    }),
    [form.formState, props]
  );

  return <DegreeSkillWithCard {...commonProps} />;
}

const DegreeSkillWithCard = withTitledCard(DegreeSkillController);

export default DegreeSkill;
