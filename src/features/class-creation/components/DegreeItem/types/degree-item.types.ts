import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type DegreeItem from "@/features/class-creation/components/DegreeItem/DegreeItem.tsx";
import type {
  DegreeCreationFormSchema,
  DegreeCreationInputItem,
} from "@/features/class-creation/components/DegreeItem/models/degree-creation.models";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface";

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

/**
 * Props for the DegreeItem component.
 */
export type DegreeItemProps = Readonly<
  PageWithControllers<DegreeCreationInputItem>
>;
