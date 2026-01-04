import type DegreeModuleSkill from "@/components/ClassCreation/diploma/degree-module-skill/DegreeModuleSkill.tsx";
import type { DegreeModuleSkillFormSchema } from "@/models/degree-module-skill.model.ts";
import type { UseFormReturn } from "react-hook-form";

export type DegreeModuleSkillProps = Readonly<{
  formId: string;
  form: UseFormReturn<DegreeModuleSkillFormSchema>;
  pageId: string;
}> &
  Omit<Parameters<typeof DegreeModuleSkill>[0], "modalMode">;
