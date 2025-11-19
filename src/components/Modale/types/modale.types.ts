import type { AppModalNames } from "@/configs/app.config.ts";
import { type ReactNode } from "react";

/**
 * Types for Modale component props
 */
export type ModaleProps = {
  children?: ReactNode;
  modaleContent: ReactNode;
  modaleName: AppModalNames;
  onOpenChange?: (id: string) => void;
  onOpen?: (id: string) => boolean;
  onNodeReady?: HTMLElement;
};

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
