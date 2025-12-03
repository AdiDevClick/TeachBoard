import { createContext } from "react";

type PopoverFieldContextType = {
  onSelect: (value: string) => void;
};

export const PopoverFieldContext =
  createContext<PopoverFieldContextType | null>(null);
