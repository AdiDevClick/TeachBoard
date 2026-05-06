import type { AppModalNames } from "@/configs/app.config";

export type GoogleOAuthProps = {
  pageId?: AppModalNames;
  submitRoute?: string;
  submitDataReshapeFn?: ((data: any) => any) | undefined;
};
