import { createTableStore } from "@/features/evaluations/main/api/store/TableStore";
import type { RowItemWithId } from "@/features/evaluations/main/api/store/types/table-store.types";
import type { Store } from "@/utils/types/table-store-registry.types";

export const DEFAULT_PERSIST_NAME = "table-store";

export class TableStoreRegistry {
  /**
   * A registry to manage multiple table stores with dynamic persistence names. This allows for creating and retrieving stores based on unique names, ensuring that each table can have its own isolated state management and persistence.
   */
  readonly #registry = new Map<string, unknown>();
  readonly #defaultName = DEFAULT_PERSIST_NAME;

  /**
   * Creates a new store instance with the given name and registers it in the registry.
   *
   * @param storeName - The name of the store to create. If not provided, the default store name will be used.
   */
  constructor(storeName?: string) {
    if (!storeName) return;

    this.#init(storeName);
  }

  #init(storeName: string) {
    if (!storeName) {
      return;
    }

    return this.#createStore(storeName);
  }

  /**
   * Creates a new store instance with the given name and registers it in the registry.
   *
   * @param storeName - The name of the store to create. If not provided, the default store name will be used.
   *
   * @returns The created store instance.
   *
   * @throws Error if a store with the same name already exists in the registry.
   */
  #createStore<T extends RowItemWithId>(storeName: string) {
    const persistName = this.#resolvePersistName(storeName);

    if (this.#registry.has(persistName)) {
      throw new Error(`Store with name "${persistName}" already exists.`);
    }

    const store = createTableStore<T>(persistName);
    this.#setStore(persistName, store);

    return store;
  }

  /**
   * Registers a store instance with the given name in the registry.
   */
  #setStore(storeName: string, store: unknown) {
    this.#registry.set(storeName, store);
  }

  /**
   * Returns the store instance associated with the given name, creating it if it doesn't exist.
   */
  getStore<T extends RowItemWithId>(storeName = this.#defaultName): Store<T> {
    const persistName = this.#resolvePersistName(storeName);
    const existingStore = this.#registry.get(persistName) as Store<T>;

    if (existingStore) {
      return existingStore;
    }

    return this.#createStore(storeName);
  }

  /**
   * Normalize the store name to ensure consistent persistence keys.
   *
   * - If the name is empty or matches the default, return the default persist name.
   * - If the name already starts with the default persist name prefix, return it as is.
   * - Otherwise, prefix the name with the default persist name.
   */
  #resolvePersistName(storeName?: string) {
    const normalizedName = storeName?.trim();

    if (!normalizedName || normalizedName === this.#defaultName) {
      return DEFAULT_PERSIST_NAME;
    }

    if (normalizedName.startsWith(`${DEFAULT_PERSIST_NAME}:`)) {
      return normalizedName;
    }

    return `${DEFAULT_PERSIST_NAME}:${normalizedName}`;
  }
}
