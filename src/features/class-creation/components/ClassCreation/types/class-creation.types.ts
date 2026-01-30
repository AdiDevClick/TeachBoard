import type { UUID } from "@/api/types/openapi/common.types.ts";
import type {
  DetailedCommandItem,
  HeadingType,
} from "@/components/Command/types/command.types.ts";
import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type ClassCreation from "@/features/class-creation/components/ClassCreation.tsx";
import type {
  ClassCreationFormSchema,
  ClassCreationInputItem,
} from "@/features/class-creation/index.ts";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";

type UserFullName = {
  firstName?: string;
  lastName?: string;
};

export type DetailedItem = DetailedCommandItem & UserFullName;

export type ClassCreationExtendedFormSchema = ClassCreationFormSchema & {
  primaryTeacherValue?: Array<[UUID, DetailedItem]>;
  tasksValues?: Array<[string, DetailedCommandItem]>;
  studentsValues?: Array<[UUID, DetailedItem]>;
};

/**
 * Props for ClassCreationController component
 */

export type ClassCreationControllerProps = AppControllerInterface<
  ClassCreationExtendedFormSchema,
  typeof API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
  typeof API_ENDPOINTS.POST.CREATE_CLASS.dataReshape
> &
  Omit<Parameters<typeof ClassCreation>[0], "modalMode">;

/**
 * Simple mutable ref shape (compatible with React's `useRef` result).
 * Declared here to avoid depending on React's deprecated `MutableRefObject` type.
 */
export type MutableRef<T> = { current: T };

export type TaskTemplatesCacheShape = [HeadingType, ...HeadingType[]];

export type DiplomaTaskContext = {
  shortTemplatesList: string[];
  [key: string]: unknown;
};

/**
 * Class creation component props.
 */
export type ClassCreationProps = { userId?: UUID } & Readonly<
  PageWithControllers<ClassCreationInputItem>
>;

/**
 * Parameters for creating disabled groups in class creation.
 */
export type CreateDisabledGroupParams = {
  dataCopy: HeadingType[];
  cachedData: HeadingType[];
  diplomaDatas: DiplomaTaskContext;
  currentDiplomaId: UUID;
  activeDiplomaIdRef: MutableRef<UUID>;
};

/**
 * Parameters for handling diploma changes.
 */
export type HandleDiplomaChangeParams = {
  currentId: UUID;
  activeDiplomaIdRef: MutableRef<UUID>;
  savedSkills: MutableRef<unknown>;
  itemToDisplay: MutableRef<unknown>;
};

/**
 * Parameters for building the tasks list with a disabled group.
 */
export type HandleFetchedTasksParams = {
  cachedData: TaskTemplatesCacheShape;
  currentDiplomaId: UUID;
  diplomaDatas: DiplomaTaskContext;
  activeDiplomaIdRef: MutableRef<UUID>;
  itemToDisplay: MutableRef<TaskTemplatesCacheShape | null>;
  isDiplomaChanged: boolean;
};
