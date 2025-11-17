import type {
  FetchJSONError,
  FetchJSONResult,
  fetchJSONOptions,
} from "@/api/types/api.types";

/**
 * Fetch API to JSON
 *
 * @description If an array is provided in options.json, it will be converted to an object before being stringified.
 *
 * @param url API endpoint
 * @param options Fetch options. If options.json is provided, it will be sent as JSON body.
 * @returns Parsed JSON response or error cause.
 */
export async function fetchJSON<
  TData extends object = Record<string, unknown>,
  TErrorBody extends object = Record<string, unknown>
>(
  url = "",
  options: fetchJSONOptions = {}
): Promise<FetchJSONResult<TData, TErrorBody>> {
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

  let signal = options.signal;

  if (!signal) {
    const controller = new AbortController();
    signal = controller.signal;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal,
    });

    if (!response.ok) {
      const filteredObject = await filterErrorResponse<TErrorBody>(response);

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
    return (err.cause as FetchJSONError<TErrorBody>) ?? err;
  }
}

/**
 * Filter response to extract relevant information
 *
 * @param response HTTP response
 * @returns Promise containing an error object
 */
async function filterErrorResponse<TErrorBody extends object>(
  response: Response
): Promise<FetchJSONError<TErrorBody>> {
  const cause = {
    status: response.status,
    statusText: response.statusText ?? null,
    ok: response.ok,
  } as FetchJSONError<TErrorBody>;

  try {
    return {
      ...cause,
      ...(await response.clone().json()),
    };
  } catch {
    return cause;
  }
}
