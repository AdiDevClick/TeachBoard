import type { fetchJSONOptions } from "@/api/types/ApiTypes.ts";

/**
 * Fetch API to JSON
 *
 * @description If an array is provided in options.json, it will be converted to an object before being stringified.
 *
 * @param url API endpoint
 * @param options Fetch options. If options.json is provided, it will be sent as JSON body.
 * @returns Parsed JSON response or error cause.
 */
export async function fetchJSON(url = "", options: fetchJSONOptions = {}) {
  const headers = {
    Accept: "application/json",
    ...options.headers,
  } as Record<string, string>;

  if (options.img) {
    headers["Content-Type"] = "multipart/form-data";
  }

  if (options.json && !options.img) {
    if (Array.isArray(options.json)) {
      options.body = JSON.stringify(Object.fromEntries(options.json));
      // options.body = Object.fromEntries(options.json);
    } else {
      options.body = JSON.stringify(options.json);
    }
    headers["Content-Type"] = "application/json; charset=UTF-8";
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(
        `HTTP Error ! Status : ${response.status} - ${response.statusText}`,
        {
          cause: {
            status: response.status,
            // message: await response.json(),
            statusText: response.statusText ?? null,
            ok: response.ok,
            ...(await response.json()),
            // fullResponse: response,
          },
        }
      );
    }

    return { ...(await response.json()), ok: response.ok };
  } catch (error) {
    return (error as Error).cause;
  }
}
