import { DEV_MODE, NO_PROXY_LOGS } from "@/configs/app.config.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";

export class ObjectReshape<T extends Record<string, unknown>> {
  #dataSource: T[] | T = [];
  readonly #shapeToBuild: Partial<Record<keyof T, unknown>> = {} as Partial<
    Record<keyof T, unknown>
  >;
  /** Indicates whether the data source is an array */
  readonly #isArray: boolean = false;
  /** Indicates whether the data source is a plain object */
  readonly #isPlainObject: boolean = false;
  /** The first saved element of the data source if it is an array.
   * Used for introspection during initialization.
   */
  #firstSourceElement: Record<string, unknown> | undefined;
  /** Stores keys from the shape to build */
  readonly #shapeKeysStore = new UniqueSet<string, Record<string, unknown>>();
  /** Stores keys from the source object */
  readonly #sourceObjectStore = new UniqueSet<
    string,
    Record<string, unknown>
  >();
  /** Stores the newly shaped item during transformation
   * @description You can build it and retrieve it via `build()` or `newShape()`
   */
  #newShapedItem: Record<string, unknown> = {};
  /** Stores the current selection during transformation */
  #currentSelection: unknown = undefined;
  /** Maps targetKey -> sourceKeys[] for property aliasing with fallback support */
  readonly #mappingProxies = new Map<string, string[]>();
  #assignedSourceKey?: string;
  readonly #perItemAdditions: Record<string, unknown> = {};

  /**
   * Creates an instance of ObjectReshape.
   *
   * @param dataSource - Datas that need to be reshaped
   * @param shapeToBuild
   */
  constructor(
    dataSource: T[] | T,
    shapeToBuild: Partial<Record<keyof T, unknown>> = {} as Partial<
      Record<keyof T, unknown>
    >
  ) {
    this.#dataSource = structuredClone(dataSource);
    this.#shapeToBuild = shapeToBuild;

    this.#isArray = this.#isValidArray(this.#dataSource);
    this.#isPlainObject = this.#isValidObject(this.#dataSource);
    this.#firstSourceElement = (this.#dataSource as T[])[0];
    this.#init();
  }

  #init() {
    if (!this.#isArray && !this.#isPlainObject) {
      throw new TypeError("Data source must be an Array");
    }
    this.#firstSourceElement = (this.#dataSource as T[])[0];

    for (const key in this.#shapeToBuild) {
      this.#shapeKeysStore.set(
        key,
        this.#shapeToBuild[key] as Record<string, unknown>
      );
    }

    for (const key in this.#firstSourceElement) {
      this.#sourceObjectStore.set(
        key,
        this.#firstSourceElement[key] as Record<string, unknown>
      );
    }
  }

  // static from<T extends Record<string, unknown>>(
  //   data: T[],
  //   shapeToBuild: Partial<Record<keyof T, unknown>>
  // ) {
  //   return new ObjectReshape<T>(data, shapeToBuild);
  // }

  // Intentionally no static wrapper here — a top-level wrapper exists below

  /**
   * Determines if the provided value is a valid non-empty array.
   *
   * @param array - The value to check.
   */
  #isValidArray(array: unknown): boolean {
    return Array.isArray(array) && array.length > 0;
  }

  /**
   * Determines if the provided value is a valid object (non-array).
   *
   * @param object - The value to check.
   */
  #isValidObject(object: unknown): boolean {
    return (
      object !== undefined &&
      typeof object === "object" &&
      !Array.isArray(object)
    );
  }

  transform(value: unknown) {
    return value;
  }

  /**
   * Assigns a shaped value to a key in the resulting shape.
   * If `selection` argument is provided, it is used; otherwise the previously
   * stored `currentSelection` or the full `dataSource` is used.
   */
  to(key: string) {
    // if selection is source : migrate all source data
    const handler = {
      get: (target: Record<string, unknown>, prop: string) => {
        if (prop === this.#currentSelection) {
          return key in target;
        }
      },
    };

    this.#newShapedItem = new Proxy(this.#newShapedItem, handler);
    return this;
  }

  /**
   * Sets the current selection to the data source for further shaping.
   */
  assignSourceTo(key: string) {
    // Clone the provided data source for shaping as we don't want to mutate the
    // original input passed by the caller.
    const clonedSource = structuredClone(this.#dataSource) as unknown[];
    // If it's an array, deep-proxy it so items are proxied before external
    // code (e.g. mappers) read from them — ensures our interceptors run
    // early enough.
    // const proxied = Array.isArray(clonedSource)
    //   ? this.deepProxy(clonedSource, this.#handler())
    //   : clonedSource;
    Object.assign(this.#newShapedItem, { [key]: clonedSource });

    this.#assignedSourceKey = key;
    this.#currentSelection = key;
    // Keep the `#dataSource` in its expected internal shape: an array with the
    // current shaped object as its single element (legacy behaviour kept but
    // not required by the rest of the implementation).
    this.#dataSource = [this.#newShapedItem as T];
    return this;
  }

  /**
   * Assigns property mappings for the proxy/build.
   *
   * **Syntax 1 - One source, multiple targets:**
   * ```ts
   * .assign([["name", "value", "displayName"]])
   * // "value" -> tries "name"
   * // "displayName" -> tries "name"
   * ```
   *
   * **Syntax 2 - Fallback chain (use `from()` helper):**
   * ```ts
   * .assign([
   *   ObjectReshape.from("name", "test", "label").to("value"),
   *   // "value" -> tries "name", then "test", then "label"
   * ])
   * ```
   *
   * For simple fallback, use `assignWithFallback()` directly.
   */
  assign(
    pairs: Array<[string, ...string[]] | { target: string; sources: string[] }>
  ) {
    for (const pair of pairs) {
      if (Array.isArray(pair)) {
        // Syntax 1: [sourceKey, targetKey1, targetKey2, ...]
        const [sourceKey, ...targetKeys] = pair;
        for (const targetKey of targetKeys) {
          this.#mappingProxies.set(targetKey, [sourceKey]);
        }
      } else {
        // Syntax 2: { target, sources } from ObjectReshape.from().to()
        this.#mappingProxies.set(pair.target, pair.sources);
      }
    }
    return this;
  }

  /**
   * Creates a fallback chain builder.
   * Use with `.to()` to specify the target property.
   *
   * @example
   * ```ts
   * .assign([
   *   ObjectReshape.from("name", "test", "label").to("value")
   * ])
   * // When accessing "value", tries "name" first, then "test", then "label"
   * ```
   */
  static from(...sourceKeys: string[]) {
    return {
      to: (targetKey: string) => ({
        target: targetKey,
        sources: sourceKeys,
      }),
    };
  }

  /**
   * Assigns a target key with multiple source keys as fallbacks.
   * The proxy will try each source key in order until it finds one that exists.
   *
   * @example
   * ```ts
   * // "displayName" will try "name", then "value", then "label"
   * .assignWithFallback("displayName", ["name", "value", "label"])
   * ```
   */
  assignWithFallback(targetKey: string, sourceKeys: string[]) {
    this.#mappingProxies.set(targetKey, sourceKeys);
    return this;
  }

  add(pairs: Record<string, unknown>) {
    // Always add at the top-level of the newly built shape. To add to the
    // items of an assigned source, use `addToItems()`.
    for (const key in pairs) {
      this.#newShapedItem[key] = pairs[key];
    }
    return this;
  }

  addToItems(pairs: Record<string, unknown>) {
    for (const key in pairs) {
      this.#perItemAdditions[key] = pairs[key];
    }
    return this;
  }

  /**
   * Copies all properties from source object except the specified excluded key.
   *
   * @param source - The source object to copy from
   * @param excludeKey - Optional key to exclude from the copy
   * @returns A new object with copied properties
   */
  #copyObjectExcluding(
    source: Record<string, unknown>,
    excludeKey?: string
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key in source) {
      if (key !== excludeKey) {
        result[key] = source[key];
      }
    }
    return result;
  }

  /**
   * Resolves the value for a target key by trying each source key in order.
   *
   * @param item - The source item to get the value from
   * @param sourceKeys - Array of source keys to try in order
   * @returns The resolved value and source key, or undefined if none found
   */
  #resolveValue(
    item: Record<string, unknown>,
    sourceKeys: string[]
  ): { value: unknown; sourceKey: string } | undefined {
    for (const sourceKey of sourceKeys) {
      if (Object.hasOwn(item, sourceKey)) {
        return { value: item[sourceKey], sourceKey };
      }
    }
    return undefined;
  }

  /**
   * Applies property mappings to an item.
   * For each targetKey -> sourceKeys mapping, tries each source key in order
   * and uses the first one that exists (fallback behavior).
   *
   * @param item - The source item to apply mappings to
   * @param target - The target object to add mapped properties to
   */
  #applyMappings(
    item: Record<string, unknown>,
    target: Record<string, unknown>
  ): void {
    for (const [targetKey, sourceKeys] of this.#mappingProxies.entries()) {
      const resolved = this.#resolveValue(item, sourceKeys);
      if (resolved) {
        target[targetKey] = resolved.value;
      }
    }
  }

  /**
   * Applies per-item additions to the target object.
   *
   * @param target - The target object to add properties to
   */
  #applyPerItemAdditions(target: Record<string, unknown>): void {
    for (const key in this.#perItemAdditions) {
      target[key] = this.#perItemAdditions[key];
    }
  }

  /**
   * Builds a single item with all mappings and additions applied.
   *
   * @param item - The source item to transform
   * @returns A new object with mappings and additions applied
   */
  #buildItem(item: Record<string, unknown>): Record<string, unknown> {
    const newItem: Record<string, unknown> = { ...item };
    this.#applyMappings(item, newItem);
    this.#applyPerItemAdditions(newItem);
    return newItem;
  }

  /**
   * Transforms an array of items by applying mappings and additions to each.
   *
   * @param sourceArray - The source array to transform
   * @returns A new array with all items transformed
   */
  #buildItemsArray(
    sourceArray: Array<Record<string, unknown>>
  ): Array<Record<string, unknown>> {
    return sourceArray.map((item) => this.#buildItem(item));
  }

  /**
   * Builds the final shape by physically creating new objects with mapped keys.
   * This is the recommended method when the result will be stored in a cache
   * (like React Query) as proxies don't survive serialization.
   *
   * @returns A new object with all mappings applied as real properties
   */
  build(): Record<string, unknown>[] {
    const result = this.#copyObjectExcluding(
      this.#newShapedItem,
      this.#assignedSourceKey
    );

    if (this.#assignedSourceKey) {
      const sourceArray = this.#newShapedItem[this.#assignedSourceKey];

      if (Array.isArray(sourceArray)) {
        result[this.#assignedSourceKey] = this.#buildItemsArray(sourceArray);
      }
    }

    return [result];
  }

  /**
   * Sets the current selection to the provided value for further shaping.
   */
  sourceElement(value: unknown) {
    this.#currentSelection = value;
    return this;
  }

  /**
   * Creates a deep proxy for the provided object, applying the given handler
   *
   * @description This is a recursive function that traverses the object structure
   *
   * @param obj - The object to be proxied
   * @param handler - The proxy handler to apply
   * @returns The proxied object
   */
  deepProxy<T extends Record<string, unknown> | unknown[]>(
    obj: T,
    handler: ProxyHandler<Record<string, unknown>>
  ): T {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    // Process arrays and objects recursively
    for (const key of Object.keys(obj)) {
      const val = (obj as Record<string, unknown>)[key];
      if (typeof val === "object" && val !== null) {
        (obj as Record<string, unknown>)[key] = this.deepProxy(
          val as Record<string, unknown> | unknown[],
          handler
        );
      }
    }

    return new Proxy(obj as Record<string, unknown>, handler) as unknown as T;
  }

  #handler(): ProxyHandler<Record<string, unknown>> {
    return {
      ownKeys: (target: Record<string, unknown>) => {
        // Include both the actual properties and mapped target keys so that
        // enumerations (Object.keys/JSON.stringify) show the mapped keys.
        const keys = new Set<string | symbol>(Reflect.ownKeys(target));
        // Add mapped target keys (e.g. "value" when mapping "name" -> "value")
        for (const targetKey of this.#mappingProxies.keys()) {
          keys.add(targetKey);
        }
        return Array.from(keys);
      },
      getOwnPropertyDescriptor: (
        target: Record<string, unknown>,
        prop: string | symbol
      ) => {
        if (typeof prop === "string") {
          const sourceKeys = this.#mappingProxies.get(prop);
          if (sourceKeys) {
            const resolved = this.#resolveValue(target, sourceKeys);
            if (resolved) {
              const desc = Reflect.getOwnPropertyDescriptor(
                target,
                resolved.sourceKey
              );
              if (desc)
                return { ...desc, enumerable: true, configurable: true };
            }
          }
        }
        return Reflect.getOwnPropertyDescriptor(target, prop);
      },
      get: (
        target: Record<string, unknown>,
        prop: string | symbol,
        receiver: unknown
      ): unknown => {
        if (typeof prop === "string") {
          // mappingProxies stores targetKey -> sourceKeys[]
          // e.g. "value" -> ["name", "label", "text"]
          const sourceKeys = this.#mappingProxies.get(prop);

          if (sourceKeys) {
            const resolved = this.#resolveValue(target, sourceKeys);
            if (resolved) {
              if (DEV_MODE && !NO_PROXY_LOGS) {
                console.debug(
                  "GET trap called for mapped prop:",
                  prop,
                  "resolved to source key:",
                  resolved.sourceKey,
                  "(tried:",
                  sourceKeys.join(" -> "),
                  ") with value:",
                  resolved.value
                );
              }
              return resolved.value;
            }
          }
        }

        return Reflect.get(target, prop, receiver);
      },
      set: (
        target: Record<string, unknown>,
        prop: string | symbol,
        value: unknown,
        receiver: unknown
      ): boolean => {
        console.log(
          "SET EARLY trap called for prop:",
          prop,
          "with value:",
          value
        );

        // Default behaviour: write directly to the target.
        return Reflect.set(target, prop, value, receiver);
      },
    };
  }

  /**
   * Renames a key in the data source items.
   * This modifies each item in `#dataSource` by renaming `oldKey` to `newName`.
   *
   * @param oldKey - The current key name to rename
   * @param newName - The new key name
   */
  rename(oldKey: string, newName: string) {
    if (!this.#isPlainObject) {
      throw new TypeError(
        "rename() can only be used if #dataSource is a plain object"
      );
    }
    if (Object.hasOwn(this.#dataSource, oldKey)) {
      const { [oldKey]: removed, ...rest } = this.#dataSource as Record<
        string,
        unknown
      >;
      this.#newShapedItem = { ...rest, [newName]: removed };
      // keep the first element reference in sync
      this.#firstSourceElement = this.#newShapedItem;
    }
    return this;
  }

  /**
   * Builds and returns a new shape object using proxies to handle property access.
   *
   * @description All nested objects/arrays are also proxied to ensure mappings work at all levels.
   */
  newShape() {
    return this.deepProxy([this.#newShapedItem], this.#handler());
  }
}
