import type { UUID } from "@/api/types/openapi/common.types.ts";
import type {
  DetailedCommandItem,
  HeadingType,
} from "@/components/Command/types/command.types.ts";
import type { AvatarsWithLabelAndAddButtonList } from "@/components/Form/exports/form.exports";
import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type {
  ClassCreationFormSchema,
  ClassCreationInputItem,
} from "@/features/class-creation/components/main/models/class-creation.models";
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
  Omit<ClassCreationProps, "modalMode">;

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
 * Avatar input item type: same as `ClassCreationInputItem` but with `type`
 * narrowed to the Button-compatible values required by `AvatarListWithLabelAndAddButton`.
 */
export type AvatarInputItem = Omit<ClassCreationInputItem, "type"> &
  Pick<Parameters<typeof AvatarsWithLabelAndAddButtonList>[0], "type">;

/**
 * Structured input controllers for the class creation form.
 * Each key corresponds to a distinct sub-section of the form.
 */
export type ClassCreationInputControllers = {
  readonly inputs: readonly ClassCreationInputItem[];
  readonly dynamicList: ClassCreationInputItem;
  readonly popover: ClassCreationInputItem;
  readonly avatar: readonly AvatarInputItem[];
  readonly yearSelection: ClassCreationInputItem;
};

/**
 * Class creation component props.
 */
export type ClassCreationProps = { userId?: UUID } & Readonly<
  Omit<
    PageWithControllers<ClassCreationInputControllers>,
    "inputControllers"
  > & {
    inputControllers?: ClassCreationInputControllers;
  }
>;

/**
 * Parameters for creating disabled groups in class creation.
 */
export type CreateDisabledGroupParams = {
  dataCopy: HeadingType[];
  cachedData: HeadingType[];
  diplomaDatas: DiplomaTaskContext;
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

/**
 * Props for the useClassCreationHandler hook, derived from ClassCreationControllerProps with only the necessary fields for handling logic.
 */
export type UseClassCreationHandlerProps = Readonly<
  Pick<
    ClassCreationControllerProps,
    "form" | "pageId" | "submitRoute" | "submitDataReshapeFn"
  >
>;
