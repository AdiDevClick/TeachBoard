import type DegreeSkill from "@/components/ClassCreation/diploma/degree-skill/DegreeSkill.tsx";
import type { useDegreeCreationForm } from "@/hooks/database/classes/useDegreeCreationForm.ts";
import type { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import type { DegreeSkillFormSchema } from "@/models/degree-skill.models.ts";
import type { FieldValues, useForm } from "react-hook-form";

export type DegreeSkillProps<T extends FieldValues = DegreeSkillFormSchema> = {
  formId?: string;
  form: ReturnType<typeof useForm<T>>;
  className?: string;
  queryHooks: ReturnType<typeof useDegreeCreationForm>;
  fetchHooks: ReturnType<typeof useFetch>;
} & Omit<Parameters<typeof DegreeSkill>[0], "modalMode">;
