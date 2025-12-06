import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

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
