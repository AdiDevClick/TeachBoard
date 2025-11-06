import type {
  FetchJSONError,
  fetchJSONOptions,
  FetchJSONResult,
} from "@/api/types/ApiTypes.ts";

/**
 * Fetch API to JSON
 *
 * @description If an array is provided in options.json, it will be converted to an object before being stringified.
 *
 * @param url API endpoint
 * @param options Fetch options. If options.json is provided, it will be sent as JSON body.
 * @returns Parsed JSON response or error cause.
 */
export async function fetchJSON(
  url = "",
  options: fetchJSONOptions = {}
): Promise<FetchJSONResult> {
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
    } else {
      options.body = JSON.stringify(options.json);
    }
    headers["Content-Type"] = "application/json; charset=UTF-8";
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const filteredObject = await filterErrorResponse(response);

      throw new Error(
        `HTTP Error ! Status : ${response.status} - ${response.statusText}`,
        {
          cause: filteredObject,
        }
      );
    }

    return { ...(await response.json()), ok: response.ok };
  } catch (error) {
    const err = error as Error;
    return (err.cause as FetchJSONError) ?? err;
  }
}

/**
 * Filter response to extract relevant information
 *
 * @param response HTTP response
 * @returns Promise containing an error object
 */
async function filterErrorResponse(
  response: Response
): Promise<FetchJSONError> {
  const cause = {
    status: response.status,
    statusText: response.statusText ?? null,
    ok: response.ok,
  };

  try {
    return {
      ...cause,
      ...(await response.clone().json()),
    };
  } catch {
    return {
      ...cause,
    };
  }
}
