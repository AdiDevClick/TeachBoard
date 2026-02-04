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
