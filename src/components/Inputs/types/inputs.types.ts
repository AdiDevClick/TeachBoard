import type { Input } from "@/components/ui/input";
import type { ComponentProps } from "react";

type SelfProps = { title?: string };

/** Props accepted by the `LabelledInput` component. */
export type LabelledInputProps = Readonly<
  Omit<ComponentProps<typeof Input>, keyof SelfProps> & SelfProps
>;
