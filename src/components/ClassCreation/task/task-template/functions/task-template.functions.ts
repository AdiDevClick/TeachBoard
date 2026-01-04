import type { UUID } from "@/api/types/openapi/common.types.ts";
import type {
  SkillsFormValues,
  SkillsViewDto,
} from "@/api/types/routes/skills.types.ts";
import {
  createDisabledGroup,
  handleDiplomaChange,
} from "@/components/ClassCreation/functions/class-creation.functions.ts";
import type { FetchSkillsDataParams } from "@/components/ClassCreation/task/task-template/types/task-template-creation.types.ts";
import type {
  DiplomaTaskContext,
  MutableRef,
} from "@/components/ClassCreation/types/class-creation.types.ts";
import type {
  DetailedCommandItem,
  HeadingType,
} from "@/components/Command/types/command.types.ts";

/**
 * Create a new Map() of form values based on selected command item details
 *
 * @param details - The details of the selected command item
 * @param formValues - The current form values
 * @returns The updated form values Map()
 */
export function updateValues(
  details: DetailedCommandItem,
  formValues?: Iterable<[UUID, SkillsFormValues]> | Map<UUID, SkillsFormValues>
) {
  const current = new Map(formValues);

  const main = details.groupId;
  const sub = details.id;
  let subSkillsSet = new Set<UUID>();

  if (current.has(main) === false) {
    subSkillsSet.add(sub);
  } else {
    const existing = current.get(main);
    subSkillsSet = new Set(existing?.subSkillId ?? []);

    if (subSkillsSet.has(sub)) {
      subSkillsSet.delete(sub);
    } else {
      subSkillsSet.add(sub);
    }

    if (subSkillsSet.size === 0) {
      current.delete(main);
    }
  }

  if (subSkillsSet.size > 0) {
    current.set(main, {
      mainSkill: main,
      subSkillId: Array.from(subSkillsSet.values()),
    });
  }

  return current;
}

/**
 * Create a view structure for task templates based on diploma data
 *
 * @param skills - The skills dataset from diploma configuration
 * @returns An array of heading structures for command items
 */
export function createTaskTemplateView(skills?: SkillsViewDto[]) {
  return (skills ?? []).map((skill) => {
    const mainSkillCode = skill.mainSkillCode ?? "Unknown Skill";
    const mainSkillId = skill.mainSkillId ?? "unknown-id";

    return {
      groupTitle: mainSkillCode,
      id: mainSkillId,
      items: skill.subSkills.map((subSkill) => ({
        value: subSkill.code,
        label: subSkill.name,
        id: subSkill.id,
      })),
    };
  });
}

/**
 * Fetch and reshape task data based on cached data and diploma information
 *
 * @param cachedData - The cached task template data
 * @param diplomaDatasParam - The diploma data parameter
 * @param currentDiplomaId - The current diploma ID
 * @param isDiplomaChanged - Flag indicating if the diploma has changed
 * @returns The reshaped task template data with disabled groups if applicable
 */
export function fetchTasksData(
  cachedData: HeadingType[],
  diplomaDatas: DiplomaTaskContext,
  currentDiplomaId: UUID,
  isDiplomaChanged: ReturnType<typeof handleDiplomaChange>,
  itemToDisplay: MutableRef<ReturnType<typeof createDisabledGroup>>,
  activeDiplomaIdRef: MutableRef<UUID>
) {
  if (!Array.isArray(cachedData)) return undefined;
  let dataCopy = itemToDisplay.current;

  if (dataCopy === null || isDiplomaChanged) {
    dataCopy = createDisabledGroup({
      dataCopy,
      cachedData,
      diplomaDatas,
      currentDiplomaId,
      activeDiplomaIdRef,
    });
    itemToDisplay.current = dataCopy;
  }
  return dataCopy;
}

/**
 * Fetch and reshape skills data based on diploma information
 *
 * @param diploma - The diploma data containing skills
 * @param savedSkills - A ref object to store and retrieve cached skills view
 * @returns The cached or newly created skills view
 */
export function fetchSkillsData(
  diploma: FetchSkillsDataParams["diploma"],
  savedSkills: FetchSkillsDataParams["savedSkills"]
) {
  if (!diploma) return undefined;
  savedSkills.current ??= createTaskTemplateView(diploma.skills);
  return savedSkills.current;
}
