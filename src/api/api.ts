import type {
  FetchJSONError,
  FetchJSONResult,
  fetchJSONOptions,
} from "@/api/types/api.types";
import type { AnyObjectProps } from "@/utils/types/types.utils";

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
  TData extends object = AnyObjectProps,
  TErrorBody extends object = AnyObjectProps,
>(
  url = "",
  options: fetchJSONOptions = {},
): Promise<FetchJSONResult<TData, TErrorBody>> {
  const { json, signal, ...rest } = options;
  const headers = new Headers(rest.headers);
  headers.set("Accept", "application/json");

  if (options.img) {
    headers.set("Content-Type", "multipart/form-data");
  }

  if (json && !options.img) {
    if (Array.isArray(json)) {
      options.body = JSON.stringify(Object.fromEntries(json));
    } else {
      options.body = JSON.stringify(json);
    }
    delete options.json;
    headers.set("Content-Type", "application/json; charset=UTF-8");
  }

  let newSignal = signal;

  if (!newSignal) {
    const controller = new AbortController();
    newSignal = controller.signal;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: newSignal,
    });

    if (!response.ok) {
      const filteredObject = await filterErrorResponse<TErrorBody>(response);
      throw new Error(
        `HTTP Error ! Status : ${response.status} - ${response.statusText}`,
        {
          cause: filteredObject,
        },
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
  response: Response,
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
