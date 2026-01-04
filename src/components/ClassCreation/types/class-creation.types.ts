import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassCreationInputItem } from "@/models/class-creation.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";

/**
 * Simple mutable ref shape (compatible with React's `useRef` result).
 * Declared here to avoid depending on React's deprecated `MutableRefObject` type.
 */
export type MutableRef<T> = { current: T };

export type CommandItem = {
  id: string | number;
  name: string;
  [key: string]: unknown;
};

export type CommandGroup = {
  groupTitle?: string;
  items: CommandItem[];
  [key: string]: unknown;
};

export type TaskTemplatesCacheShape = [CommandGroup, ...CommandGroup[]];

type DiplomaTaskContext = {
  shortTemplatesList: string[];
  [key: string]: unknown;
};

/**
 * Class creation component props.
 */
export type ClassCreationProps = { userId?: string } & Readonly<
  PageWithControllers<ClassCreationInputItem>
>;

/**
 * Parameters for creating disabled groups in class creation.
 */
export type CreateDisabledGroupParams = {
  dataCopy: TaskTemplatesCacheShape;
  cachedData: TaskTemplatesCacheShape;
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
