import { Pencil } from "lucide-react";

/**
 * PageTitle component
 *
 * @description Component to display a page title with an icon
 * Edition still needs to be implemented
 *
 * @param children - title content
 */
export function PageTitle({ children }: { children: string }) {
  return (
    <div className="page-title-container">
      <h1>{children}</h1>
      <Pencil className="page-title-icon w-3" />
    </div>
  );
}
