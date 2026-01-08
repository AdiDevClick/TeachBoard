import type DegreeItem from "@/components/ClassCreation/diploma/degree-item/DegreeItem.tsx";
import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { DegreeCreationFormSchema } from "@/models/degree-creation.models.ts";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";

/**
 * Props for the DegreeItemController component.
 *
 * @template T - The type of the form values, extending DegreeCreationFormSchema.
 */

export type DegreeItemControllerProps = AppControllerInterface<
  DegreeCreationFormSchema,
  unknown,
  typeof API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape
> &
  Omit<Parameters<typeof DegreeItem>[0], "modalMode">;
