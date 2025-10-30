import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as React from "react";

type VerticalSelectProps = React.ComponentProps<typeof Select> & {
  label?: React.ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
  /** id to apply on the Trigger element for label association */
  triggerId?: string;
};

export function VerticalFieldSelect({
  label,
  placeholder,
  fullWidth = true,
  className,
  children,
  triggerId,
  ...props
}: VerticalSelectProps) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {label ? (
        <Label className="w-full" htmlFor={triggerId ?? undefined}>
          {label}
        </Label>
      ) : null}

      <Select {...props}>
        <SelectTrigger
          id={triggerId}
          className={cn(fullWidth ? "w-full" : "w-fit")}
          size="default"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {/* Allow consumers to pass SelectItem / SelectGroup etc. */}
          {children}
        </SelectContent>
      </Select>
    </div>
  );
}

export default VerticalFieldSelect;
