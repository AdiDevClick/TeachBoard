import type { DegreeItemController } from "@/components/ClassCreation/diploma/degree-item/controller/DegreeItemController.tsx";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { useDegreeCreationForm } from "@/hooks/database/classes/useDegreeCreationForm.ts";

export type ResettableForm = {
  reset: (values?: Record<string, unknown>) => void;
};

export type UseDegreeCreationProps = {
  queryHooks: ReturnType<typeof useDegreeCreationForm>;
  form: ResettableForm;
  hookOptions?: {
    pageId: AppModalNames;
    inputControllers: Parameters<
      typeof DegreeItemController
    >[0]["inputControllers"];
  };
};
