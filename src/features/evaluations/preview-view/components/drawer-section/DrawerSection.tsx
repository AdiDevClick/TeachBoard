import { Separator } from "@/components/ui/separator";
import type { DrawerSectionProps } from "@/features/evaluations/preview-view/components/drawer-section/types/drawer-section.types";

/**
 * A section component for the evaluation detail drawer.
 *
 * @description It can be used to display different sections of the evaluation details, such as results, absents, comments, etc.
 *
 * @param disabled - If true, the section will not be rendered.
 * @param title - The title of the section.
 * @param separator - If true, a separator will be rendered above the section.
 * @param children - The content of the section.
 */
export function DrawerSection({
  disabled = false,
  title,
  separator = true,
  children,
}: DrawerSectionProps) {
  if (disabled) {
    return null;
  }

  return (
    <>
      {separator && <Separator />}
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold">{title}</h3>
        {children}
      </section>
    </>
  );
}
