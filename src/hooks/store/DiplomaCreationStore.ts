import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type Degree = Record<string, unknown>;

type DiplomaCreationStore = {
  diplomaName: string;
  diplomaDescription: string;
  degrees: Degree[];
  setDiplomaName: (name: string) => void;
  setDiplomaDescription: (description: string) => void;
  setDegrees: (degrees: Degree[]) => void;
};

export const useDiplomaCreationStore = create(
  devtools(
    immer(
      combine(
        {
          diplomaName: "",
          diplomaDescription: "",
          degrees: [] as Degree[],
        } as DiplomaCreationStore,
        (set, get) => ({
          setDiplomaName(name: string) {
            set((state) => {
              state.diplomaName = name;
            });
          },
          setDiplomaDescription(description: string) {
            set((state) => {
              state.diplomaDescription = description;
            });
          },
          setDegrees(degrees: Degree[]) {
            set((state) => {
              state.degrees = degrees;
            });
          },
        })
      )
    )
  )
);
