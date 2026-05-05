import type { DialogContextType } from "@/api/contexts/types/context.types.ts";
import { UUID_SCHEMA } from "@/api/types/openapi/common.types";
import { debugLogs } from "@/configs/app-components.config.ts";
import { LANGUAGE, type AppModalNames } from "@/configs/app.config";
import type {
  AnimationsOptions,
  AnyObjectProps,
  PreventDefaultAndStopPropagation,
  ProbeProxyResult,
  PromiseStateResult,
  PromiseStateSettledResult,
} from "@/utils/types/types.utils.ts";
import { clsx, type ClassValue } from "clsx";
import { lazy, type ComponentType } from "react";
import { twMerge } from "tailwind-merge";
import type z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number to a fixed number of decimal places and parse it back to a float.
 *
 * @param value - The number to format and parse.
 * @param decimals - The number of decimal places to format to (default is 2).
 * @returns The formatted number as a float.
 */
export function formatParseFloat(value: number, decimals = 2): number {
  return Number.parseFloat(value.toFixed(decimals));
}

/**
 * Build a map where each key mirrors its own name, typed from the input array.
 */
export function mirrorProperties(
  properties: readonly string[] | Record<string, unknown>,
) {
  const keys = Array.isArray(properties) ? properties : Object.keys(properties);

  return Object.fromEntries(keys.map((m) => [m, m]));
}

/**
 * Format a date range for display.
 *
 * @param from Start date
 * @param to End date
 * @returns Formatted date range string
 */
export function formatRangeCompat(from: Date, to: Date) {
  try {
    const dtf = new Intl.DateTimeFormat(LANGUAGE, {
      hour: "numeric",
      minute: "2-digit",
    });
    if (typeof dtf.formatRange === "function") {
      return dtf.formatRange(from, to);
    }
  } catch (e) {
    console.log(e);
    // Some environments may throw if Intl is restricted—ignore and fallback
  }
}

export function formatDate(date: Date) {
  if (!date) return "";

  return date.toLocaleDateString(LANGUAGE, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Crer une promesse qui se resoudra
 * après un délai défini en paramètre
 * @param duration - La durée de l'attente
 * @param message - Message à retourner dans la promesse si besoin
 */
export function wait(duration: number, message = "") {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(message);
    }, duration);
  });
}

/**
 * Reject a promise after a specified duration with a given message,
 *
 * @description Optionnaly using an AbortController to allow cancellation.
 *
 * @param duration - The duration in milliseconds to wait before rejecting the promise
 * @param message - The message to reject the promise with
 * @param abortController - Optional AbortController to allow cancellation of the timeout
 */
export function waitAndFail(
  duration: number,
  message: string,
  abortController?: AbortController,
) {
  return new Promise((resolve, reject) => {
    const errPayload = {
      status: 408,
      error: "Request Timeout",
      ok: false,
    };

    const timer = setTimeout(() => {
      // If aborted before timeout fired, settle as resolved to avoid leaking a pending promise
      if (abortController?.signal.aborted) {
        resolve(undefined);
        return;
      }
      reject(new Error(message, { cause: errPayload }));
    }, duration);

    // If an AbortController is provided, clear the timeout and settle when aborted
    if (abortController) {
      const onAbort = () => {
        clearTimeout(timer);
        abortController.signal.removeEventListener("abort", onAbort);
        resolve(undefined);
      };

      if (abortController.signal.aborted) {
        clearTimeout(timer);
        resolve(undefined);
      } else {
        abortController.signal.addEventListener("abort", onAbort, {
          once: true,
        });
      }
    }
  });
}

export function parseFromObject<T>(obj: T): T | null {
  try {
    if (typeof obj !== "object" || !obj) {
      throw new Error("Input is not a valid object");
    }

    const stringified = JSON.stringify(obj);
    const parsed = JSON.parse(stringified);

    if (!parsed) {
      throw new Error("Something went wrong while parsing the object");
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Parse an ID, ensuring it is a valid UUID string.
 *
 * @returns The parsed UUID string if valid, or null if invalid.
 *
 * @example
 * const validId = "123e4567-e89b-12d3-a456-426614174000";
 */
export function parseToUuid(id?: string) {
  try {
    const parsed = UUID_SCHEMA.safeParse(id);

    if (!parsed.success) {
      throw new Error("Invalid ID");
    }

    return parsed.data;
  } catch {
    return null;
  }
}

/**
 * Parse an object using a Zod schema, throwing an error if validation fails.
 */
export function zodParseFromObject<T>(obj: unknown, schema: z.ZodType<T>): T {
  const parsed = schema.safeParse(obj);

  if (!parsed.success) {
    throw new Error("Invalid data", { cause: parsed.error });
  }

  return parsed.data;
}

/**
 * Track the state of a promise, returning its status and value or reason once it settles.
 *
 * @param promise The promise to track, or a Map of promises to track with their keys included in the result
 * @param allowImmediatePending If true (default), the function returns immediately with `{ status: 'pending' }` if the wrapped promises have not yet settled. If false, the returned promise waits for one of the wrapped promises to settle and returns its status object.
 * @returns A promise that resolves to either { status: 'pending' } or a status object describing the settled promise
 */
export function promiseState<T = AnyObjectProps>(
  promise: Promise<T> | Map<string, Promise<T>>,
  allowImmediatePending = true,
) {
  const pendingState: PromiseStateResult<T> = { status: "pending" };

  // Map<string, Promise> -> normalize each promise to a status-object (includes the key)
  if (promise instanceof Map) {
    const wrappedPromises = [];

    for (const [key, promiseItem] of promise.entries()) {
      wrappedPromises.push(
        promiseItem
          .then(
            (value): PromiseStateSettledResult<T> => ({
              status: "fulfilled",
              value,
              key,
            }),
          )
          .catch(
            (error_): PromiseStateSettledResult<T> => ({
              status: "rejected",
              reason: (error_ as Error)?.message ?? String(error_),
              key,
            }),
          ),
      );
    }

    return allowImmediatePending
      ? Promise.race([...wrappedPromises, Promise.resolve(pendingState)])
      : Promise.race(wrappedPromises);
  }

  // Single promise -> normalize to a status-object and optionally race against pending state
  const normalized = promise
    .then(
      (value): PromiseStateSettledResult<T> => ({
        status: "fulfilled",
        value,
      }),
    )
    .catch(
      (error_): PromiseStateSettledResult<T> => ({
        status: "rejected",
        reason: (error_ as Error)?.message ?? String(error_),
      }),
    );

  return allowImmediatePending
    ? Promise.race([normalized, Promise.resolve(pendingState)])
    : normalized;
}

/**
 * Prevent the default action and stop propagation of an event.
 *
 * @param e  Event to prevent default action and stop propagation
 */
export function preventDefaultAndStopPropagation(
  e: PreventDefaultAndStopPropagation,
) {
  if (!e) return;
  e.preventDefault();
  e.stopPropagation();
}

/** Handle the opening of a modal dialog.
 *
 * @param e - The mouse event that triggered the action.
 * @param dialogFns - An object containing functions to manage dialog state.
 * @param modalName - The name of the modal to open (default is "signup").
 */
export function handleModalOpening({
  e,
  dialogFns,
  modalName = "signup",
}: {
  e: PreventDefaultAndStopPropagation;
  // e: MouseEvent<HTMLAnchorElement>;
  dialogFns: Pick<DialogContextType, "closeAllDialogs" | "openDialog">;
  modalName?: AppModalNames;
}) {
  dialogFns.closeAllDialogs();
  dialogFns.openDialog(e, modalName);
}

/**
 * Check the validity of props against required and forbidden keys.
 *
 * @see checkPropsValidity.test.ts for detailed implementation and logging of prop validation.
 *
 * @param props - The props object to validate.
 * @param required - An array of required prop keys.
 * @param forbidden - An array of forbidden prop keys.
 *
 * @returns True if any forbidden keys are present or any required keys are missing; otherwise, false.
 *
 * @example
 * ```ts
 * const props = {
 *   topLayerObject: {
 *     firstNested: "nestedValue",
 *     firstVeryNested: {
 *       firstVeryNestedResult: {
 *         extremelyNested: "value2",
 *       },
 *     },
 *   },
 *   topLayerOther: "abc",
 *   topLayerExtra: 1,
 * };
 *
 * const required = [
 *   {
 *     topLayerObject: [
 *       "firstNested",
 *       { firstVeryNested: [{ firstVeryNestedResult: ["extremelyNested"] }] },
 *       "topLayerOther",
 *       "topLayerExtra",
 *     ],
 *   },
 * ];
 *
 * const forbidden = ["imForbidden"];
 * ```
 *
 * const result = checkPropsValidity(props, required, forbidden);
 * // result will be true if any of the required keys are missing or if any forbidden keys are present, false otherwise
 * ```
 *
 * In this example, `checkPropsValidity` will check if `props` contains the required keys specified in `required` and does not contain any of the forbidden keys specified in `forbidden`. The function will return `true` if any required keys are missing or if any forbidden keys are present, and `false` otherwise.
 *
 * @remarks Use array to search inside a layer, use object to search inside this layer and next ones.
 * For example, with the required array `[{ item: ["title", "number"] }]`, the function will check if there is an `item` key in props, and if so, it will check if `item` is an object that contains both `title` and `number` keys.
 * If `item` is missing or not an object, or if either `title` or `number` is missing from `item`, the function will consider the required keys as missing.
 */
export function checkPropsValidity(
  props: object,
  required: (string | Record<string, unknown>)[],
  forbidden: string[],
) {
  if (typeof props !== "object" || props === null) {
    debugLogs("Props validation failed: Props is not an object", props);
    return true;
  }

  const newRequired = new Set(required);
  const newForbidden = new Set(forbidden);
  const propsKeys = new Set(Reflect.ownKeys(props));

  const { forbiddenPresent, forbiddenKeysFound } = findForbiddenKeys(
    propsKeys,
    newForbidden,
  );

  // If proxy special-case applies, helper returns an early boolean result
  const missingResult = findMissingRequiredKeys(props, newRequired, propsKeys);

  const requiredIsMissing = missingResult.requiredIsMissing;
  const requiredMissing = missingResult.missingKeys;

  const baseDetails = {
    originalProvidedProps: props,
    listOfPropsKeys: propsKeys,
    requiredKeys: required,
    forbiddenKeys: forbidden,
    __requiredMissing: requiredMissing,
    __forbiddenKeysFound: forbiddenKeysFound,
    shouldBeProxyfied: missingResult.shouldBeProxyfied ?? [],
  };

  displayLogs(forbiddenPresent, requiredIsMissing, baseDetails);

  return forbiddenPresent || requiredIsMissing;
}

/**
 * Find forbidden keys present in props.
 *
 * @param propsKeys - Set of keys present in the props object
 * @param forbiddenKeys - Set of forbidden prop keys
 *
 * @returns Object indicating if forbidden keys are present and which ones were found
 */
function findForbiddenKeys(
  propsKeys: Set<PropertyKey>,
  forbiddenKeys: Set<string>,
) {
  const found: string[] = [];

  for (const k of forbiddenKeys) {
    if (propsKeys.has(k)) found.push(k);
  }

  return {
    forbiddenPresent: found.length > 0,
    forbiddenKeysFound: found,
  };
}

/**
 * Find missing required keys and handle proxy-specific early return.
 *
 * @param props - The props object to validate
 * @param k - The key to probe
 *
 * @returns ProbeProxyResult indicating the status of the key probe
 */
function probeProxyKey(props: object, k: PropertyKey): ProbeProxyResult {
  const notSupportedMessage = "Proxy or Reflect.ownKeys not supported";
  const returnDetails: ProbeProxyResult = {
    trapAvailable: false,
    isProxyfied: true,
    unsupported: false,
  };

  try {
    if (typeof Proxy === "undefined" || typeof Reflect.ownKeys !== "function") {
      throw new TypeError(notSupportedMessage);
    }

    const trapAvailable = Reflect.ownKeys(props).includes(k as string | symbol);

    if (!trapAvailable) {
      throw new TypeError("Proxy traps not available");
    }

    Reflect.get(props, k);
    const isProxyfied = props.__isProxyfied === true && k !== undefined;

    returnDetails.trapAvailable = true;
    returnDetails.isProxyfied = isProxyfied;

    return returnDetails;
  } catch (error) {
    if (error instanceof TypeError && error.message === notSupportedMessage) {
      returnDetails.unsupported = true;
    }

    return returnDetails;
  }
}

/**
 * Find missing required keys in props.
 *
 * @description This will check under proxy conditions if needed.
 *
 * @param props - The props object to validate
 * @param requiredKeys - Set of required prop keys
 * @param propsKeys - Set of keys present in the props object
 */
function findMissingRequiredKeys(
  props: Record<string, unknown>,
  requiredKeys: Set<string | Record<string, unknown>>,
  propsKeys: Set<PropertyKey>,
) {
  const missing = new Set<string>();
  const shouldBeProxyfied = new Set<string>();

  for (const k of requiredKeys) {
    const keyIsObject =
      typeof k === "object" && k !== null && !Array.isArray(k);

    if (keyIsObject) {
      handleNestedRequiredKey(props, k, missing, shouldBeProxyfied);
      continue;
    }

    // Only probe the single non-object required key we're currently iterating on
    probeLogic(props, new Set([k]), propsKeys, missing, shouldBeProxyfied);
  }

  return {
    shouldBeProxyfied: Array.from(shouldBeProxyfied),
    requiredIsMissing: missing.size > 0,
    missingKeys: Array.from(missing),
  };
}

/**
 * Process a required key that is itself an object mapping nested keys to required sub-keys arrays.
 * Extracted to reduce complexity in findMissingRequiredKeys.
 *
 * @param props - The props object to validate
 * @param keyObj - The object describing nested required keys (e.g. { nested: ['a','b'] })
 * @param missing - Set to collect missing keys
 * @param shouldBeProxyfied - Set to collect keys that should be proxyfied
 */
function handleNestedRequiredKey(
  props: Record<string, unknown>,
  keyObj: Record<string, unknown>,
  missing: Set<string>,
  shouldBeProxyfied: Set<string>,
) {
  for (const subKey of Object.keys(keyObj)) {
    let arraySubKeys = keyObj[subKey];

    if (!Array.isArray(arraySubKeys)) {
      arraySubKeys = [arraySubKeys];
    }

    const newProps = props[subKey] as Record<string, unknown> | undefined;

    if (typeof newProps !== "object" || newProps === null) {
      missing.add(subKey);
      continue;
    }

    const newPropsKeys = new Set(Reflect.ownKeys(newProps));

    // Recursive call - propagate missing information upwards
    const nestedResult = findMissingRequiredKeys(
      newProps,
      new Set(arraySubKeys as (string | Record<string, unknown>)[]),
      newPropsKeys,
    );

    if (nestedResult.requiredIsMissing) {
      // Consider the entire nested object as missing (for simplicity in logs)
      missing.add(subKey);
      for (const p of nestedResult.shouldBeProxyfied) {
        shouldBeProxyfied.add(`${subKey}.${p}`);
      }
    }
  }
}

/**
 * Probe logic for a set of required keys.
 * @param props - The props object to validate
 * @param requiredKeys - Set of required prop keys to probe
 * @param propsKeys - Set of keys present in the props object
 * @param missing - Set to collect missing keys
 * @param shouldBeProxyfied - Set to collect keys that should be proxyfied
 */
function probeLogic(
  props: Record<string, unknown>,
  requiredKeys: Set<string | Record<string, unknown>>,
  propsKeys: Set<PropertyKey>,
  missing: Set<string>,
  shouldBeProxyfied: Set<string>,
) {
  for (const k of requiredKeys) {
    if (!isPropertyKey(k)) {
      continue;
    }

    if (hasRequiredKey(props, k)) {
      continue;
    }

    const { trapAvailable, isProxyfied, unsupported } = probeProxyKey(props, k);

    if (!trapAvailable) {
      shouldBeProxyfied.add(k);
      missing.add(k);
      continue;
    }

    if (!isProxyfied && unsupported && !propsKeys.has(k)) {
      missing.add(k);
    }
  }
}

function isPropertyKey(
  key: string | symbol | Record<string, unknown>,
): key is string | symbol {
  return typeof key === "string" || typeof key === "symbol";
}

function hasRequiredKey(props: Record<string, unknown>, key: string | symbol) {
  return key in props || Object.hasOwn(props, key);
}

/**
 * @param forbiddenPresent - Whether forbidden keys are present
 * @param requiredIsMissing - Whether required keys are missing
 * @param baseDetails - The base details to log
 */
function displayLogs(
  forbiddenPresent: boolean,
  requiredIsMissing: boolean,
  baseDetails: object,
) {
  if (forbiddenPresent) {
    debugLogs(`Props validation failed: Forbidden prop key(s) present in`, {
      type: "forbiddenProp",
      ...baseDetails,
    });
  }

  if (requiredIsMissing) {
    debugLogs(
      `Props validation failed: Required prop key(s) missing or invalid in`,
      { type: "propsValidation", ...baseDetails },
    );
  }
}

/**
 * Generate a display name for a higher-order component (HOC) by combining the HOC's name with the wrapped component's name.
 *
 * @param hocName - The name of the higher-order component (e.g., "withController").
 * @param WrappedComponent - The original component being wrapped by the HOC.
 * @param Component - The resulting component created by the HOC that will have its display name set.
 */
export function createNameForHOC(
  hocName: string,
  WrappedComponent: ComponentType<any>,
  Component: ComponentType<any>,
) {
  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  Component.displayName = `${hocName}(${wrappedComponentName})`;
}

/**
 * Generate a display name for a component that is the output of a higher-order component (HOC).
 *
 * @description Usefull when you export directly a component created by a HOC without assigning it
 *
 * @param hocName - The name of the higher-order component (e.g., "withController").
 * @param outputName - The name of the output component (e.g., "StepFourController").
 * @param Component - The resulting component created by the HOC that will have its display name set.
 */
export function createComponentName(
  hocName: string,
  outputName: string,
  Component: ComponentType<any>,
) {
  Component.displayName = `${hocName}(${outputName})`;
}
/**
 * Defines the animation for the evaluation card
 *
 * @param isActive - Whether the animation is active, which determines the animation direction
 * @returns An object containing the style for the evaluation card animation
 */
export const animation = (
  isActive: boolean,
  options: AnimationsOptions | null,
) => {
  const { incoming, outgoing } = options ?? {};
  const {
    name: incomingName = "incomingName",
    duration: incomingDuration = "500",
    delay: incomingDelay = "0",
  } = incoming ?? {};
  const {
    name: outgoingName = "outgoingName",
    duration: outgoingDuration = "500",
    delay: outgoingDelay = "0",
  } = outgoing ?? {};

  const animation = isActive
    ? `${incomingName} ${incomingDuration}ms both ${incomingDelay}ms`
    : `${outgoingName} ${outgoingDuration}ms both ${outgoingDelay}ms`;

  return { style: { animation } };
};

/**
 * Utility function to lazily import a React component for code-splitting and performance optimization.
 *
 * @param path - The path to the module containing the component to import, relative to the src directory (e.g., "@/features/evaluations/main/EvaluationsView").
 * @param exportName - The name of the exported component to import from the module (optional, defaults to the default export).
 *
 * @returns A React component that is loaded lazily using React's `lazy` function.
 */
export function lazyImport<T extends ComponentType<any>>(
  path: string,
  exportName?: string,
) {
  return lazy(async () => {
    const resolvedModulePath = normalizeLazyModulePath(path);

    if (!resolvedModulePath) {
      throw new Error(`Unable to resolve lazy import: ${path}`);
    }

    const module = await import(/* @vite-ignore */ resolvedModulePath);
    const exported = exportName ? module[exportName] : module;

    return { default: exported as T };
  });
}

function normalizeLazyModulePath(path: string) {
  if (path.startsWith("@/")) {
    return `/src/${path.slice(2)}`;
  }

  return path;
}

/**
 * Create a display string for a date to be shown in a drawer, formatted in French locale and including only the date and time up to minutes.
 *
 * @param date - The date string to format
 * @returns A formatted date string for display in a drawer, or an empty string if the input date is undefined
 */
export function createDrawerDisplayDate(date?: string) {
  if (!date) return "";
  return new Date(date)
    .toLocaleString("fr-FR")
    .replace(" ", " à ")
    .split(":")
    .slice(0, 2)
    .join(":");
}
