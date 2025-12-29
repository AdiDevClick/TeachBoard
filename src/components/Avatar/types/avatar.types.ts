import type { ReactNode } from "react";

/**
 * Props for SimpleAvatar component
 */
export type SimpleAvatarProps = {
  /** Source URL of the avatar image */
  src: string;
  /** Alternative text for the avatar image */
  alt: string;
  /** Fallback content to display if the image fails to load */
  fallback: ReactNode;
};

/**
 * Props for SimpleAvatarList component
 */
export type SimpleAvatarListProps = {
  /** Array of SimpleAvatarProps to render multiple avatars */
  items: SimpleAvatarProps[];
};
