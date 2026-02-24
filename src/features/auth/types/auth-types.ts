import type { Dispatch, SetStateAction } from "react";

/**
 * @fileoverview Types for the LoginFormController component and related functions.
 */

export type ForgottenPwLinkParams = {
  isPwForgotten: boolean;
  setIsPwForgotten: Dispatch<SetStateAction<boolean>>;
};

export type ForgottenPwAndDefaultLinkTexts = {
  textToDisplay: {
    defaultText: string;
    pwForgottenLinkTo: string;
    buttonText: string;
  };
};

export type ForgottenPw = ForgottenPwLinkParams &
  ForgottenPwAndDefaultLinkTexts;
