import type { FetchingInputItem } from "@/types/AppInputControllerInterface";
import type z from "zod";

export type StepOneInputItem = FetchingInputItem<z.infer<unknown>>;
