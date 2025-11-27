import type {
  WithSimpleAlertProps,
  ModalProps,
} from "@/components/Modal/types/modal.types.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import type {
  AnyComponentLike,
  ComponentLike,
  ContentPropsFor,
  EnsureContentList,
} from "@/utils/types/types.utils.ts";
import type { ComponentType } from "react";

type SimpleAlertRequiredProps = Pick<
  WithSimpleAlertProps,
  "headerTitle" | "headerDescription"
>;

type StandardModalProps = Partial<Omit<ModalProps, "modalName">>;

type SimpleAlertModalProps = SimpleAlertRequiredProps &
  Partial<
    Omit<
      WithSimpleAlertProps,
      "modalName" | "headerTitle" | "headerDescription"
    >
  >;

export type StandardModalConfig<
  Name = AppModalNames,
  TComponent extends ComponentLike<unknown> = AnyComponentLike
> = {
  modalName: Name;
  type: ComponentType<ModalProps>;
  modalContent: TComponent;
  modalProps?: StandardModalProps;
  contentProps: ContentPropsFor<TComponent>;
};

/**
 * WithSimpleAlert wrapper config (returns a prewired modal without a modalContent prop)
 */
export type SimpleAlertConfig<Name = AppModalNames> = {
  modalName: Name;
  type: ComponentType<WithSimpleAlertProps>;
  modalProps: SimpleAlertModalProps;
  contentProps?: never;
  modalContent?: never;
};

export type AppModal = StandardModalConfig | SimpleAlertConfig;

type StrictModalsList<T extends readonly AppModal[]> = EnsureContentList<
  T,
  "contentProps"
>;

export function defineModalsList(modals: readonly AppModal[]): AppModal[] {
  return [...modals];
}

export function defineStrictModalsList<const T extends readonly AppModal[]>(
  modals: StrictModalsList<T>
): AppModal[] {
  return [...modals];
}

export function isStandardModal(
  modal: AppModal
): modal is StandardModalConfig<AppModalNames, AnyComponentLike> {
  return "modalContent" in modal;
}

export function isSimpleAlertModal(
  modal: AppModal
): modal is SimpleAlertConfig<AppModalNames> {
  return !("modalContent" in modal);
}

export interface AppModalsProps {
  modalsList?: AppModal[];
}
