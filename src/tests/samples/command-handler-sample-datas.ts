import type {
  CreateSkillResponseData,
  SkillDto,
} from "@/api/types/routes/skills.types.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { vi } from "vitest";

export const skillModal: AppModalNames = "new-task-skill";
export const skillModuleModal: AppModalNames = "new-degree-module-skill";
export const skillFetchActivity = USER_ACTIVITIES.fetchModulesSkills;
export const skillApiEndpoint = "/api/skills" as const;
export const skillQueryKey = [skillModuleModal, skillApiEndpoint] as const;
export const skillQueryKeySingle = [skillFetchActivity, skillApiEndpoint];

export const skillFetched: SkillDto = {
  id: "00000000-0000-0000-0000-000000000002",
  name: "fetched-item",
  code: "FET",
};

export const skillCreated: SkillDto = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "new",
  code: "NEW",
};

export function stubFetchWithItems() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      if (init?.method === "POST") {
        const response: CreateSkillResponseData = skillCreated;
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: response }),
        } as unknown);
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({ data: [skillFetched] }),
      } as unknown);
    })
  );
}
