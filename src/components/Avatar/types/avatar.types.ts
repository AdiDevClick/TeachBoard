import type { ReactNode } from "react";

export type SimpleAvatarProps = {
  /** Source URL of the avatar image */
  src: string;
  /** Alternative text for the avatar image */
  alt: string;
  /** Fallback content to display if the image fails to load */
  fallback: ReactNode;
};
