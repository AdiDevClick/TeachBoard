import type {
  ModaleProps,
  WithSimpleAlertProps,
} from "@/components/Modale/types/modale.types.ts";
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

type StandardModaleProps = Partial<Omit<ModaleProps, "modaleName">>;

type SimpleAlertModaleProps = SimpleAlertRequiredProps &
  Partial<
    Omit<
      WithSimpleAlertProps,
      "modaleName" | "headerTitle" | "headerDescription"
    >
  >;

export type StandardModaleConfig<TComponent extends ComponentLike<unknown>> = {
  modaleName: AppModalNames;
  type: ComponentType<ModaleProps>;
  modaleContent: TComponent;
  modaleProps?: StandardModaleProps;
  contentProps: ContentPropsFor<TComponent>;
};

/**
 * WithSimpleAlert wrapper config (returns a prewired modal without a modaleContent prop)
 */
export type SimpleAlertConfig = {
  modaleName: AppModalNames;
  type: ComponentType<WithSimpleAlertProps>;
  modaleProps: SimpleAlertModaleProps;
  contentProps?: never;
  modaleContent?: never;
};

export type AppModale =
  | StandardModaleConfig<AnyComponentLike>
  | SimpleAlertConfig;

type StrictModalesList<T extends readonly AppModale[]> = EnsureContentList<
  T,
  "contentProps"
>;

export function defineModalesList(modales: readonly AppModale[]): AppModale[] {
  return [...modales];
}

export function defineStrictModalesList<const T extends readonly AppModale[]>(
  modales: StrictModalesList<T>
): AppModale[] {
  return [...modales];
}

export function isStandardModale(
  modale: AppModale
): modale is StandardModaleConfig<AppModalNames, AnyComponentLike> {
  return "modaleContent" in modale;
}

export function isSimpleAlertModale(
  modale: AppModale
): modale is SimpleAlertConfig<AppModalNames> {
  return !("modaleContent" in modale);
}

export interface AppModalesProps {
  modalesList?: AppModale[];
}
