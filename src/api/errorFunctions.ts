import type { MutationResponse } from "@/hooks/queries/types/QueriesTypes.ts";

/**
 * Get a user-friendly error message based on the HTTP status code and response.
 *
 * @param status - The HTTP status code.
 * @param response - The response object containing error details.
 * @returns A user-friendly error message.
 */
export function getErrorMessage(status?: number, response?: MutationResponse) {
  const fallback =
    "HTTP Error! Please try again later or verify if you are connected to the internet.";

  if (!status && response?.message) {
    return response.message;
  }

  if (!status) {
    return fallback;
  }

  const errorMessage = response?.error ?? undefined;

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
