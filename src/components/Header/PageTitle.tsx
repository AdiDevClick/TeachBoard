import { Pencil } from "lucide-react";
import type { ReactNode } from "react";

/**
 * PageTitle component
 *
 * @description Component to display a page title with an icon
 * Edition still needs to be implemented
 *
 * @param children - title content
 */
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="page__title-container">
      <h1>{children}</h1>
      <Pencil className="title__icon w-3" />
    </div>
  );
}
