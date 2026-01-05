import type { SkillDto } from "@/api/types/routes/skills.types.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { vi } from "vitest";

export const skillModal: AppModalNames = "new-task-skill";
export const skillModuleModal: AppModalNames = "new-degree-module-skill";
export const skillFetchActivity = USER_ACTIVITIES.fetchModulesSkills;
export const skillApiEndpoint = "/api/skills" as const;
export const skillQueryKey = [skillModuleModal, skillApiEndpoint] as const;
export const skillQueryKeySingle = [skillFetchActivity, skillApiEndpoint];

// Degree module controller uses the SUBSKILLS endpoint (see API_ENDPOINTS.GET.SKILLS.endPoints.SUBSKILLS)
export const skillSubApiEndpoint = "/api/skills/sub" as const;
export const skillSubQueryKey = [
  skillModuleModal,
  skillSubApiEndpoint,
] as const;

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
    vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      const urlStr = String(url || "");

      if (init?.method === "POST") {
        // fetchJSON expects the server payload under `data`
        // NOTE: we return the SkillDto directly to keep tests that pass custom dataReshapeFn working.
        const response: { data: SkillDto } = { data: skillCreated };

        console.log("stubFetchWithItems POST ->", response);
        return Promise.resolve({
          ok: true,
          json: async () => response,
        } as unknown);
      }

      // For DegreeModule controller endpoints, the SKILLS GET reshaper expects SkillsFetch shape (has `Skills`).
      if (
        urlStr.includes("/api/skills/sub") ||
        urlStr.includes("/api/skills/main")
      ) {
        const getResp = { data: { Skills: [skillFetched] } };

        console.log("stubFetchWithItems GET (skills) ->", getResp);
        return Promise.resolve({
          ok: true,
          json: async () => getResp,
        } as unknown);
      }

      // For legacy/unit tests using `/api/skills` directly without the SKILLS reshaper,
      // return the raw array of items under `data`.
      if (urlStr.endsWith("/api/skills") || urlStr.endsWith("/api/skills/")) {
        const getResp = { data: [skillFetched] };

        console.log("stubFetchWithItems GET (/api/skills) ->", getResp);
        return Promise.resolve({
          ok: true,
          json: async () => getResp,
        } as unknown);
      }

      // Default fallback
      const getResp = { data: [skillFetched] };

      console.log("stubFetchWithItems GET (default) ->", getResp);
      return Promise.resolve({
        ok: true,
        json: async () => getResp,
      } as unknown);
    })
  );
}
