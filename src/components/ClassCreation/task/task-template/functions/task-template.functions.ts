import type { SkillsViewDto } from "@/api/types/routes/skills.types.ts";

/**
 * Create a new Map() of form values based on selected command item details
 *
 * @param details - The details of the selected command item
 * @param formValues - The current form values
 * @returns The updated form values Map()
 */
export function updateValues(
  details: Record<string, unknown>,
  formValues: Map<unknown, unknown>
) {
  const current = new Map(formValues);

  const main = details.groupId;
  const sub = details.id;
  let subSkillsSet = new Set();

  if (!current.has(main)) {
    subSkillsSet.add(sub);
  } else {
    const existing = current.get(main) as
      | { subSkillId?: unknown[] }
      | undefined;
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
