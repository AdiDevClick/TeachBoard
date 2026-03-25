import { USER_ACTIVITIES } from "@/configs/app.config";
import {
  createSearchParamsEndpoint,
  resolveFetchCacheKey,
} from "@/hooks/database/fetches/functions/use-fetch.functions";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types";
import { describe, expect, it } from "vitest";

describe("use-fetch.functions", () => {
  it("builds endpoint with search params", () => {
    const params: FetchParams = {
      contentId: USER_ACTIVITIES.classCreation,
      url: "/api/students",
      method: "GET",
      searchParams: {
        filterBy: "classId",
      },
    };

    expect(createSearchParamsEndpoint(params)).toBe(
      "/api/students?filterBy=classId",
    );
  });

  it("resolves cache key with canonical url when cachedFetchKey is missing", () => {
    const params: FetchParams = {
      contentId: USER_ACTIVITIES.classCreation,
      url: "/api/students",
      method: "GET",
      searchParams: {
        filterBy: "classId",
      },
    };

    expect(resolveFetchCacheKey(params)).toEqual([
      USER_ACTIVITIES.classCreation,
      "/api/students?filterBy=classId",
    ]);
  });

  it("prioritizes cachedFetchKey over generated key", () => {
    const params: FetchParams = {
      contentId: USER_ACTIVITIES.classCreation,
      url: "/api/students",
      method: "GET",
      searchParams: {
        filterBy: "classId",
      },
      cachedFetchKey: ["search-students", "/api/students"],
    };

    expect(resolveFetchCacheKey(params)).toEqual([
      "search-students",
      "/api/students",
    ]);
  });
});
