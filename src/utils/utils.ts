import type { DialogContextType } from "@/api/contexts/types/context.types.ts";
import { debugLogs } from "@/configs/app-components.config.ts";
import { LANGUAGE, type AppModalNames } from "@/configs/app.config";
import type {
  PreventDefaultAndStopPropagation,
  ProbeProxyResult,
} from "@/utils/types/types.utils.ts";
import { clsx, type ClassValue } from "clsx";
import { type ComponentType } from "react";
import { twMerge } from "tailwind-merge";

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
 * @param props - The props object to validate.
 * @param required - An array of required prop keys.
 * @param forbidden - An array of forbidden prop keys.
 *
 * @returns True if any forbidden keys are present or any required keys are missing; otherwise, false.
 */
export function checkPropsValidity(
  props: Record<string, unknown>,
  required: string[],
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
function probeProxyKey(
  props: Record<string, unknown>,
  k: PropertyKey,
): ProbeProxyResult {
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
      ...baseDetails,
    });
  }

  if (requiredIsMissing) {
    debugLogs(
      `Props validation failed: Required prop key(s) missing or invalid in`,
      { ...baseDetails },
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
