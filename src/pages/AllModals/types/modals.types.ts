import type {
  ModalProps,
  WithSimpleAlertProps,
} from "@/components/Modal/types/modal.types.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import type {
  AnyComponentLike,
  ContentPropsFor,
  EnsureContentList,
} from "@/utils/types/types.utils.ts";
import type { ComponentType } from "react";

type StandardModalProps = Omit<ModalProps, "modalName" | "modalContent">;

type SimpleAlertModalProps = Omit<WithSimpleAlertProps, "modalName">;

export type StandardModalConfig<T extends AnyComponentLike> = {
  type: ComponentType<ModalProps>;
  modalContent: T;
  modalProps?: StandardModalProps;
  contentProps: ContentPropsFor<T>;
};

/**
 * WithSimpleAlert wrapper config (returns a prewired modal without a modalContent prop)
 */
export type SimpleAlertConfig = {
  type: ComponentType<WithSimpleAlertProps>;
  modalProps: SimpleAlertModalProps;
  contentProps?: never;
  modalContent?: never;
};

export type AppModal<T extends ComponentType = AnyComponentLike> = {
  modalName: AppModalNames;
  id?: string;
} & (StandardModalConfig<T> | SimpleAlertConfig);

type StrictModalsList<T extends readonly AppModal[]> = EnsureContentList<
  T,
  "contentProps"
>;

export function defineModalsList<T extends AppModal[]>(modals: T): T {
  return modals;
}

export function defineStrictModalsList<T extends readonly AppModal[]>(
  modals: StrictModalsList<T>,
): T {
  return modals;
}

export function isStandardModal(
  modal: AppModal,
): modal is AppModal & StandardModalConfig<AnyComponentLike> {
  return "modalContent" in modal;
}

export function isSimpleAlertModal(
  modal: AppModal,
): modal is AppModal & SimpleAlertConfig {
  return !("modalContent" in modal);
}

export interface AppModalsProps {
  modalsList?: AppModal[];
}
