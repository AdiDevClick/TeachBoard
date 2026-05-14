import type { FetchJSONError } from "@/api/types/api.types";
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

/* Root component props */
export type RootProps = {
  contentType?: "error";
};

/** Error object containing the backend payload */
export type CustomError<T extends object = Record<string, unknown>> = Error &
  FetchJSONError<T>;

export type FieldTypes<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
};

/**
 * Type representing the different content states of the application
 *
 * - "app": The main application content is displayed.
 * - "loading": A loading state is displayed, typically while data is being fetched, sessions is being validated, or the application is initializing.
 * - "error": An error state is displayed, usually when an unexpected error occurs in the application.
 */
export type AppContent = "app" | "loading" | "error";
export type AppContentProps = Readonly<{
  render: AppContent;
}>;
