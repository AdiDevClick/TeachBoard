import type { FieldStoreState } from "@/api/store/types/field-store.types";
import { enableMapSet } from "immer";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

enableMapSet();

const DEFAULT_VALUES = (creationValues: Partial<FieldStoreState>) => ({
  values: new Set<string>(),
  multiSelection: false,
  resetKey: undefined,
  name: "default",
  ...creationValues,
});

const DEFAULT_VALUE = new Set<string>();

const createFieldStore = (
  multiSelection = false,
  resetKey?: string | number,
  name = "default",
) =>
  create(
    immer(
      combine(
        DEFAULT_VALUES({ multiSelection, resetKey, name }),
        (set, get) => ({
          getValue(defaultValue?: string | Set<string>) {
            const { values, multiSelection: isMultiSelection } = get();

            if (isMultiSelection) {
              return values.size > 0 ? values : (defaultValue ?? DEFAULT_VALUE);
            }

            if (values.size === 0) {
              return defaultValue ?? undefined;
            }

            return values.values().next().value;
          },
          setValue(value: string) {
            const currentValue = get().values.values().next().value;
            if (currentValue === value) {
              return;
            }

            set((state) => {
              state.values = new Set([value]);
            });
          },
          updateValue(value: string) {
            set((state) => {
              const nextValues = new Set(state.values);
              if (nextValues.has(value)) {
                nextValues.delete(value);
              } else {
                nextValues.add(value);
              }

              state.values = nextValues;
            });
          },
          deleteValue(value: string) {
            set((state) => {
              if (!state.values.has(value)) {
                return;
              }

              const nextValues = new Set(state.values);
              nextValues.delete(value);
              state.values = nextValues;
            });
          },
          resetValues() {
            set((state) => {
              if (state.values.size === 0) {
                return;
              }

              state.values = new Set<string>();
            });
          },
          resetByKey(newResetKey: string | number) {
            const { resetKey: currentResetKey } = get();
            if (currentResetKey === newResetKey) {
              return;
            }

            set((state) => {
              state.resetKey = newResetKey;
              state.values = new Set<string>();
            });
          },
        }),
      ),
    ),
  );

const storeMap = new Map<string, ReturnType<typeof createFieldStore>>();

export const getFieldStore = (
  multiSelection?: boolean,
  resetKey?: string | number,
  storeName = "default",
) => {
  if (!storeMap.has(storeName)) {
    storeMap.set(
      storeName,
      createFieldStore(multiSelection, resetKey, storeName),
    );
  }

  const store = storeMap.get(storeName);
  if (!store) {
    throw new Error(`Field store not found for ${storeName}`);
  }

  return store;
};

export const useFieldStore = (
  multiSelection?: boolean,
  resetKey?: string | number,
  storeName = "default",
) => {
  return getFieldStore(multiSelection, resetKey, storeName)();
};
