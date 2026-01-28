import type {
  ClassModules,
  ClassModuleSubSkill,
  ClassTasks,
  StepsCreationState,
  StudentEvaluationModuleType,
  StudentWithPresence,
} from "@/api/store/types/steps-creation-store.types";
import type { UUID } from "@/api/types/openapi/common.types.ts";
import { DEV_MODE } from "@/configs/app.config.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";

type SetFn = (
  partial:
    | StepsCreationState
    | ((state: StepsCreationState) => void | StepsCreationState),
  replace?: boolean,
  action?: string,
) => void;

type GetFn = () => StepsCreationState;

type StepsCreationDebugRehydrators = {
  ensureCollectionsInDraft: (state: StepsCreationState) => void;
  ensureCollections: () => {
    students: UniqueSet<UUID, StudentWithPresence>;
    tasks: UniqueSet<UUID, ClassTasks>;
    modules: UniqueSet<UUID, ClassModules>;
  };
};

const rehydrateUniqueSet = <
  K,
  V extends { [key: string]: unknown } | unknown[],
>(
  value: unknown,
): UniqueSet<K, V> => {
  if (value instanceof UniqueSet) {
    return value as UniqueSet<K, V>;
  }

  if (value instanceof Map) {
    return new UniqueSet<K, V>(null, Array.from(value.entries()) as [K, V][]);
  }

  if (Array.isArray(value)) {
    return new UniqueSet<K, V>(null, value as Array<V | [K, V]>);
  }

  if (value && typeof value === "object") {
    return new UniqueSet<K, V>(
      null,
      Object.entries(value as Record<string, V>) as [K, V][],
    );
  }

  return new UniqueSet<K, V>();
};

const rehydrateSet = <T>(value: unknown): Set<T> => {
  const parseSerializedList = (raw: string): T[] | null => {
    if (!raw.startsWith("l[") || !raw.endsWith("]")) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw.slice(1));
      return Array.isArray(parsed) ? (parsed as T[]) : null;
    } catch {
      return null;
    }
  };

  const expandSerializedItems = (items: Iterable<unknown>) => {
    const result: T[] = [];
    for (const item of items) {
      if (typeof item === "string") {
        const parsed = parseSerializedList(item);
        if (parsed) {
          result.push(...parsed);
          continue;
        }
      }
      result.push(item as T);
    }
    return result;
  };

  if (value instanceof Set) {
    const expanded = expandSerializedItems(value);
    return new Set<T>(expanded);
  }

  if (Array.isArray(value)) {
    return new Set<T>(expandSerializedItems(value));
  }

  if (typeof value === "string") {
    const parsed = parseSerializedList(value);
    if (parsed) {
      return new Set<T>(parsed);
    }
  }

  if (value && typeof value === "object") {
    return new Set<T>(expandSerializedItems(Object.values(value)));
  }

  return new Set<T>();
};

const normalizeSubSkills = (
  subSkills: UniqueSet<UUID, ClassModuleSubSkill>,
) => {
  for (const subSkill of subSkills.values()) {
    if (subSkill?.isLinkedToTasks) {
      subSkill.isLinkedToTasks = rehydrateSet<ClassTasks["id"]>(
        subSkill.isLinkedToTasks,
      );
    }
  }
};

const normalizeModules = (modules: UniqueSet<UUID, ClassModules>) => {
  for (const module of modules.values()) {
    module.tasksList = rehydrateSet<ClassTasks["id"]>(module.tasksList);

    if (module.studentsToEvaluate) {
      module.studentsToEvaluate = rehydrateSet<UUID>(module.studentsToEvaluate);
    }

    if (!(module.subSkills instanceof UniqueSet)) {
      module.subSkills = rehydrateUniqueSet<UUID, ClassModuleSubSkill>(
        module.subSkills,
      );
    }

    normalizeSubSkills(module.subSkills);
  }
};

const normalizeStudentEvaluations = (
  students: UniqueSet<UUID, StudentWithPresence>,
) => {
  for (const student of students.values()) {
    const modules = student.evaluations?.modules;

    if (modules && !(modules instanceof UniqueSet)) {
      student.evaluations!.modules = rehydrateUniqueSet<
        UUID,
        StudentEvaluationModuleType
      >(modules);
    }

    const modulesSet = student.evaluations?.modules;
    if (!modulesSet) continue;

    for (const module of modulesSet.values()) {
      if (!(module.subSkills instanceof UniqueSet)) {
        module.subSkills = rehydrateUniqueSet<
          UUID,
          StudentEvaluationModuleType["subSkills"] extends UniqueSet<
            UUID,
            infer Item
          >
            ? Item
            : never
        >(module.subSkills);
      }
    }
  }
};

export const createStepsCreationDebugRehydrators = (
  get: GetFn,
  set: SetFn,
): StepsCreationDebugRehydrators => {
  if (!DEV_MODE) {
    return {
      ensureCollectionsInDraft: () => undefined,
      ensureCollections: () => {
        const current = get();
        return {
          students: current.students,
          tasks: current.tasks,
          modules: current.modules,
        };
      },
    };
  }

  const ensureCollectionsInDraft = (state: StepsCreationState) => {
    if (!(state.students instanceof UniqueSet)) {
      state.students = rehydrateUniqueSet<UUID, StudentWithPresence>(
        state.students,
      );
    }

    if (!(state.tasks instanceof UniqueSet)) {
      state.tasks = rehydrateUniqueSet<UUID, ClassTasks>(state.tasks);
    }

    if (!(state.modules instanceof UniqueSet)) {
      state.modules = rehydrateUniqueSet<UUID, ClassModules>(state.modules);
    }

    normalizeModules(state.modules);
    normalizeStudentEvaluations(state.students);
  };

  const ensureCollections = () => {
    const current = get();
    const nextStudents = rehydrateUniqueSet<UUID, StudentWithPresence>(
      current.students,
    );
    const nextTasks = rehydrateUniqueSet<UUID, ClassTasks>(current.tasks);
    const nextModules = rehydrateUniqueSet<UUID, ClassModules>(current.modules);

    normalizeModules(nextModules);
    normalizeStudentEvaluations(nextStudents);

    if (
      current.students !== nextStudents ||
      current.tasks !== nextTasks ||
      current.modules !== nextModules
    ) {
      set(
        (state) => {
          state.students = nextStudents;
          state.tasks = nextTasks;
          state.modules = nextModules;
        },
        undefined,
        "debug/rehydrateCollections",
      );
    }

    return {
      students: nextStudents,
      tasks: nextTasks,
      modules: nextModules,
    };
  };

  return {
    ensureCollectionsInDraft,
    ensureCollections,
  };
};
