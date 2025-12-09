import type DegreeModuleSkill from "@/components/ClassCreation/diploma/degree-module-skill/DegreeModuleSkill.tsx";
import type { DegreeModuleSkillFormSchema } from "@/models/degree-module-skill.model.ts";
import type { FieldValues, useForm } from "react-hook-form";

export type DegreeModuleSkillProps<
  T extends FieldValues = DegreeModuleSkillFormSchema
> = {
  formId?: string;
  form: ReturnType<typeof useForm<T>>;
  queryHooks: ReturnType<typeof DegreeModuleSkill>["queryHooks"];
  fetchHooks: ReturnType<typeof DegreeModuleSkill>["fetchHooks"];
} & Omit<Parameters<typeof DegreeModuleSkill>[0], "modalMode">;
