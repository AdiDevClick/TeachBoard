import { CardTitle } from "@/components/ui/card.tsx";
import type { ReactNode } from "react";

export type GenericTitleProps = {
  className?: string;
  text?: string;
  children?: ReactNode;
};
export function GenericTitle({
  className,
  text,
  children,
}: Readonly<GenericTitleProps>) {
  return (
    <CardTitle className={className}>
      {text}
      {children}
    </CardTitle>
  );
}
