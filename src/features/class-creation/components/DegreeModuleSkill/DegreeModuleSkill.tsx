import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import {
  DEGREE_MODULE_SKILL_CARD_TITLE,
  DEGREE_MODULE_SKILL_FOOTER_PROPS,
} from "@/features/class-creation/components/DegreeModuleSkill/config/degree-module-skill.configs";
import { DegreeModuleSkillController } from "@/features/class-creation/components/DegreeModuleSkill/controllers/DegreeModuleSkillController.tsx";
import { degreeSubSkillsCreationInputControllers } from "@/features/class-creation/components/DegreeModuleSkill/forms/degree-module-skill-inputs";
import type {
  DegreeModuleSkillFormSchema,
  DegreeModuleSkillInputItem,
} from "@/features/class-creation/components/DegreeModuleSkill/models/degree-module-skill.model";
import moduleSkillSchema from "@/features/class-creation/components/DegreeModuleSkill/models/degree-module-skill.model";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

  const commonProps = {
    pageId,
    inputControllers,
    formId,
    className,
    modalMode,
    card: {
      card: { className },
      title: DEGREE_MODULE_SKILL_CARD_TITLE,
      footer: {
        ...DEGREE_MODULE_SKILL_FOOTER_PROPS,
        formState: form.formState,
        formId,
      },
    },
    ...props,
    form,
  };

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
