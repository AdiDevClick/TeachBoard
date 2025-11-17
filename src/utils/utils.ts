import { LANGUAGE } from "@/configs/app.config";
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
