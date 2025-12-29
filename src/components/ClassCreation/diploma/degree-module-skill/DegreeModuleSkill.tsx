import { DegreeModuleSkillController } from "@/components/ClassCreation/diploma/degree-module-skill/controller/DegreeModuleSkillController.tsx";
import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { degreeSubSkillsCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import type {
  DegreeModuleSkillFormSchema,
  DegreeModuleSkillInputItem,
} from "@/models/degree-module-skill.model.ts";
import moduleSkillSchema from "@/models/degree-module-skill.model.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Création de nouvelles compétences",
  description:
    "Ces compétences pourront être associées aux modules de diplôme.",
};

const footerProps = { submitText: "Ajouter", cancelText: "Annuler" };

/**
 * View component for creating a new degree skill.
 *
 * @description This inits Zod validated form
 * @param pageId - The ID of the page.
 * @param formId - The ID of the form.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 * @param modalMode - Whether the component is in modal mode.
 * @param props - Additional props.
 */
export function DegreeModuleSkill({
  pageId = "new-degree-module-skill",
  modalMode = true,
  inputControllers = degreeSubSkillsCreationInputControllers,
  ...props
}: Readonly<PageWithControllers<DegreeModuleSkillInputItem>>) {
  const formId = pageId + "-form";
  const form = useForm<DegreeModuleSkillFormSchema>({
    resolver: zodResolver(moduleSkillSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      code: "",
    },
  });
  const commonProps = useMemo(
    () => ({
      pageId,
      inputControllers,
      formId,
      modalMode,
      footerProps: {
        ...footerProps,
        formState: form.formState,
        formId,
      },
      titleProps,
      ...props,
      form,
    }),
    [form.formState, props]
  );

  return <DegreeModuleSkillWithCard {...commonProps} />;
}

const DegreeModuleSkillWithCard = withTitledCard(DegreeModuleSkillController);

export default DegreeModuleSkill;
