import type { DialogContextType } from "@/api/contexts/types/context.types.ts";
import { debugLogs } from "@/configs/app-components.config.ts";
import { LANGUAGE, type AppModalNames } from "@/configs/app.config";
import type {
  PreventDefaultAndStopPropagation,
  ProbeProxyResult,
} from "@/utils/types/types.utils.ts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  const propsKeys = new Set(Object.keys(props));

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
function findForbiddenKeys(propsKeys: Set<string>, forbiddenKeys: Set<string>) {
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
  k: string,
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

    const trapAvailable = Reflect.ownKeys(props).includes(k);

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
  requiredKeys: Set<string>,
  propsKeys: Set<string>,
) {
  const missing = new Set<string>();
  const shouldBeProxyfied = new Set<string>();

  for (const k of requiredKeys) {
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

  return {
    shouldBeProxyfied: Array.from(shouldBeProxyfied),
    requiredIsMissing: missing.size > 0,
    missingKeys: Array.from(missing),
  };
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
