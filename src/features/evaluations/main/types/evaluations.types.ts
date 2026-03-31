import type { AppModalNames } from "@/configs/app.config";

export type EvaluationsMainProps = Readonly<{
  apiEndpoint?: string;
  dataReshapeFn?: (data: unknown) => unknown;
  task?: AppModalNames;
}>;
