import type { UUID } from "@/api/types/openapi/common.types.ts";
import type {
  SkillsFormValues,
  SkillsViewDto,
} from "@/api/types/routes/skills.types.ts";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";

/**
 * Create a new Map() of form values based on selected command item details
 *
 * @param details - The details of the selected command item
 * @param formValues - The current form values
 * @returns The updated form values Map()
 */
export function updateValues(
  details: CommandItemType,
  formValues?: Iterable<[UUID, SkillsFormValues]> | Map<UUID, SkillsFormValues>,
) {
  const current = new Map(formValues);

  const main = details.groupId;
  if (!main) return current;

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
      moduleId: main,
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
export function createTaskTemplateView(modules?: SkillsViewDto[]) {
  return (modules ?? []).map((module) => {
    const mainSkillCode = module.code ?? "Unknown Skill";
    const mainSkillId = module.id ?? "unknown-id";

    return {
      groupTitle: mainSkillCode,
      id: mainSkillId,
      items: module.subSkills.map((subSkill) => ({
        value: subSkill.code,
        label: subSkill.name,
        id: subSkill.id,
      })),
    };
  });
}
