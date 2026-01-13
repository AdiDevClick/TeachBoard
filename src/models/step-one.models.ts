import type { FetchingInputItem } from "@/components/Inputs/types/inputs.types.ts";
import type z from "zod";

export type StepOneInputItem = FetchingInputItem<z.infer<void>>;
