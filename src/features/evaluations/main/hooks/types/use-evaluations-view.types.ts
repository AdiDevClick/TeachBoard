import type { AppModalNames } from "@/configs/app.config";

/**
 * Type definition for the properties accepted by the useEvaluationsView hook.
 */
export type UseEvaluationsViewProps = Readonly<{
  apiEndpoint?: (id: string) => string;
  pageId?: AppModalNames;
  dataReshapeFn?: (data: unknown) => unknown;
}>;
