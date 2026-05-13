import type { AppModalNames } from "@/configs/app.config";
import type { DataReshapeFn } from "@/types/AppInputControllerInterface";

export type OAuthProvider = "google" | "microsoft" | (string & {});

export type OAuthProps = {
  pageId?: AppModalNames;
  submitRoute?: string;
  submitDataReshapeFn?: DataReshapeFn;
  provider?: OAuthProvider;
};
