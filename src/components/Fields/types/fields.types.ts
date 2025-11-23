import type { HTMLAttributes, PropsWithChildren } from "react";

/**  Field description component with an embedded link. */
export type AppFieldDescriptionWithLinkProps = {
  linkText: string;
  linkTo: string;
} & PropsWithChildren &
  HTMLAttributes<HTMLAnchorElement>;
