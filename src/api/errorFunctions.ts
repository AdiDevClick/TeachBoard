import type { ErrorInterface, ErrorMeta } from "@/types/AppErrorInterface";
import { toast } from "sonner";

/**
 * Get a user-friendly error message based on the HTTP status code and response.
 *
 * @param status - The HTTP status code.
 * @param response - The response object containing error details.
 * @returns A user-friendly error message.
 */
export function getErrorMessage(
  status?: number,
  errorPayload?: Partial<ErrorInterface & ErrorMeta> | undefined,
  retry?: number
): string {
  const fallback =
    "HTTP Error! Please try again later or verify if you are connected to the internet.";

  if (!status) {
    return errorPayload?.message ?? errorPayload?.error ?? fallback;
  }

  if (!navigator.onLine) {
    return "You appear to be offline. Please check your internet connection and try again.";
  }

  if (retry && retry < 3) {
    toast.info(
      `A server error occurred. Retrying... (${retry} attempts left)`,
      {
        position: "top-right",
      }
    );
  }

  if (retry === 0) {
    return "After multiple attempts, the server is unreachable. Please try again later or contact support.";
  }

  const errorMessage = errorPayload?.message ?? errorPayload?.error;

  switch (status) {
    case 400:
      return errorMessage ?? "Bad Request";
    case 401:
      return errorMessage ?? "Unauthorized";
    case 403:
      return errorMessage ?? "Forbidden";
    case 404:
      return (
        errorMessage ??
        "The requested resource was not found. Please contact support if the issue persists."
      );
    case 500:
      return errorMessage ?? "Server error occurred during submission.";
    default:
      return fallback;
  }
}
