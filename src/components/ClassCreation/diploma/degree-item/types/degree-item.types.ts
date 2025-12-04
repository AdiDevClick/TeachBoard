import type { useDegreeCreationForm } from "@/hooks/database/classes/useDegreeCreationForm.ts";
import type {
  DegreeCreationFormSchema,
  DegreeCreationInputItem,
} from "@/models/degree-creation.models.ts";
import type { FieldValues, useForm } from "react-hook-form";

export type DegreeItemProps<T extends FieldValues = DegreeCreationFormSchema> =
  {
    formId?: string;
    form: ReturnType<typeof useForm<T>>;
    inputControllers?: DegreeCreationInputItem[];
    pageId?: string;
    className?: string;
    queryHooks: ReturnType<typeof useDegreeCreationForm>;
  };
