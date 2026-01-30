import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { DegreeModuleSkillController } from "@/features/class-creation/components/DegreeModuleSkill/controllers/DegreeModuleSkillController.tsx";
import { degreeSubSkillsCreationInputControllers } from "@/features/class-creation/components/DegreeModuleSkill/forms/degree-module-skill-inputs";
import type {
  DegreeModuleSkillFormSchema,
  DegreeModuleSkillInputItem,
} from "@/features/class-creation/components/DegreeModuleSkill/models/degree-module-skill.model";
import moduleSkillSchema from "@/features/class-creation/components/DegreeModuleSkill/models/degree-module-skill.model";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

export const degreeModuleTitleProps = {
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
  className = "grid gap-4",
  inputControllers = degreeSubSkillsCreationInputControllers,
  ...props
}: Readonly<PageWithControllers<DegreeModuleSkillInputItem>>) {
  const form = useForm<DegreeModuleSkillFormSchema>({
    resolver: zodResolver(moduleSkillSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const formId = pageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId,
      inputControllers,
      formId,
      className,
      modalMode,
      card: {
        card: { className },
        title: degreeModuleTitleProps,
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
    <DegreeModuleSkillWithCard {...commonProps}>
      <DegreeModuleSkillWithCard.Title />
      <DegreeModuleSkillWithCard.Content />
      <DegreeModuleSkillWithCard.Footer />
    </DegreeModuleSkillWithCard>
  );
}

const DegreeModuleSkillWithCard = withTitledCard(DegreeModuleSkillController);

export default DegreeModuleSkill;
