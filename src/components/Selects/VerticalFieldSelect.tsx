import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/utils";
import { type ComponentProps, ReactNode, useId } from "react";

type VerticalSelectProps = ComponentProps<typeof Select> & {
  label?: ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
  /** id to apply on the Trigger element for label association */
  triggerId?: string;
  children?: ReactNode;
};

/**
 * A card-like select field with vertical layout on selection options.
 *
 * @param label - Label for the select field
 * @param placeholder - Placeholder text for the select field
 * @param fullWidth - Whether the select field should take full width
 * @param className - Additional class names for the container
 * @param children - Allow consumers to pass SelectItem / SelectGroup etc... to be rendered inside the select field
 * @param props - Additional props for the Select component
 */
export function VerticalFieldSelect({
  label,
  placeholder,
  fullWidth = true,
  className,
  children,
  ...props
}: VerticalSelectProps) {
  const id = useId();

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {label && (
        <Label className="w-full" htmlFor={id}>
          {label}
        </Label>
      )}

      <Select {...props}>
        <SelectTrigger
          id={id}
          className={cn(fullWidth ? "w-full" : "w-fit")}
          size="default"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}

export default VerticalFieldSelect;
