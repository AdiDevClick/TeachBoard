import type { PropsWithChildren, HTMLAttributes } from "react";

/**
 * PageTitleProps type definition
 *
 * @description Props for the PageTitle component, which extends HTML div attributes and includes children for the title content.
 */
export type PageTitleProps = Readonly<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
>;
