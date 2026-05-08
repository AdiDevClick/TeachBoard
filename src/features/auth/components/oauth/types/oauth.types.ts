import type { AppModalNames } from "@/configs/app.config";

export type OAuthProvider = "google" | "microsoft";

export type OAuthProps = {
  pageId?: AppModalNames;
  submitRoute?: string;
  submitDataReshapeFn?: (data: any) => any;
  provider?: OAuthProvider;
};
