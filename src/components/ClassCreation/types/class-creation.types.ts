import type { ClassCreationInputItem } from "@/models/class-creation.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";

/**
 * Simple mutable ref shape (compatible with React's `useRef` result).
 * Declared here to avoid depending on React's deprecated `MutableRefObject` type.
 */
export type MutableRef<T> = { current: T };

type CommandItem = {
  id: string | number;
  name: string;
  [key: string]: unknown;
};

type CommandGroup = {
  groupTitle?: string;
  items: CommandItem[];
  [key: string]: unknown;
};

type TaskTemplatesCacheShape = [CommandGroup, ...CommandGroup[]];

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
  cachedData: TaskTemplatesCacheShape;
  diplomaDatas: DiplomaTaskContext;
  currentDiplomaId: unknown;
  activeDiplomaIdRef: MutableRef<unknown>;
};

/**
 * Parameters for handling diploma changes.
 */
export type HandleDiplomaChangeParams = {
  currentId: unknown;
  activeDiplomaIdRef: MutableRef<unknown>;
  savedSkills: MutableRef<unknown>;
  itemToDisplay: MutableRef<unknown>;
};

/**
 * Parameters for building the tasks list with a disabled group.
 */
export type HandleFetchedTasksParams = {
  cachedData: TaskTemplatesCacheShape;
  currentDiplomaId: unknown;
  diplomaDatas: DiplomaTaskContext;
  activeDiplomaIdRef: MutableRef<unknown>;
  itemToDisplay: MutableRef<TaskTemplatesCacheShape | null>;
  isDiplomaChanged: boolean;
};
