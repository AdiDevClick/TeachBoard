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
