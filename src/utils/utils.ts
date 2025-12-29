import type { DialogContextType } from "@/api/contexts/types/context.types.ts";
import { LANGUAGE, type AppModalNames } from "@/configs/app.config";
import type { PreventDefaultAndStopPropagation } from "@/utils/types/types.utils.ts";
import { clsx, type ClassValue } from "clsx";
import type { MouseEvent } from "react";
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
  e: PreventDefaultAndStopPropagation
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
  e: MouseEvent<HTMLAnchorElement>;
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
 * @returns True if any forbidden keys are present or any required keys are missing; otherwise, false.
 */
export function checkPropsValidity(
  props: unknown,
  required: string[],
  forbidden: string[]
) {
  if (typeof props !== "object" || props === null) return true;
  const propsRecord = props as Record<string, unknown>;

  const forbiddenPresent = forbidden.some(
    (forbiddenKey) => forbiddenKey in propsRecord
  );

  const requiredPresent = required.some((requiredKey) => {
    if (!(requiredKey in propsRecord)) return true;
    const value = propsRecord[requiredKey];
    return value === undefined || value === null || value === "";
  });
  return forbiddenPresent || requiredPresent;
}
