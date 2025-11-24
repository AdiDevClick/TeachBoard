import type { AppModalNames } from "@/configs/app.config.ts";
import { type PropsWithChildren, type ReactNode, type Ref } from "react";

/**
 * Types for Modale component props
 */
export type ModaleProps = {
  modaleContent: ReactNode;
  modaleName: AppModalNames;
  onOpenChange?: (id: string) => void;
  onOpen?: (id: string) => boolean;
  onNodeReady?: HTMLElement;
} & PropsWithChildren;

export type ModalState = {
  forward: boolean | null;
  isReady: HTMLElement | false;
  previousUrl: string;
  modaleName: string;
  isOpen: boolean;
  locationState: string;
  url: string;
  historyIdx: number | null | undefined;
  isHandledByPopState: boolean;
  isHandledByUserEvent: boolean;
  userInput: string | number | null;
};

type SimpleAlertExtraProps = {
  headerTitle: string;
  headerDescription: string;
  ref?: Ref<HTMLDivElement>;
};

export type WithSimpleAlertProps = Omit<ModaleProps, "modaleContent"> &
  SimpleAlertExtraProps;
