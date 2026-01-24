import { DEV_MODE, NO_PROXY_LOGS } from "@/configs/app.config.ts";

export class ObjectReshape<T extends Record<string, unknown>> {
  #dataSource: T[] | T = [];
  readonly #shapeToBuild: Partial<Record<keyof T, unknown>> = {} as Partial<
    Record<keyof T, unknown>
  >;
  /** Indicates whether the data source is an array */
  #isArray: boolean = false;
  /** Indicates whether the data source is a plain object */
  #isPlainObject: boolean = false;
  /** The first saved element of the data source if it is an array.
   * Used for introspection during initialization.
   */
  #firstSourceElement: Record<string, unknown> | undefined;
  /** Stores the newly shaped item during transformation
   * @description Retrieve it via `newShape()` (proxies are the canonical API)
   */
  #newShapedItem: Record<string, unknown> = null!;
  /** Stores the current selection during transformation */
  #currentSelection = [];
  /** Maps targetKey -> sourceKeys[] for property aliasing with fallback support */
  readonly #mappingProxies = new Map<string, string[]>();
  #assignedSourceKey?: string;
  #perItemAdditions: Record<string, unknown> = {};
  /** Maps targetKey -> compute function for dynamic property creation */
  readonly #computedProperties = new Map<
    string,
    (item: Record<string, unknown>) => unknown
  >();

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
    >,
  ) {
    this.#dataSource = this.#deepClone(dataSource);
    this.#shapeToBuild = shapeToBuild;

    this.#init();
  }

  /**
   * Deep clone that handles proxied objects
   * Falls back to JSON serialization if structuredClone fails
   */
  #deepClone<T>(data: T): T {
    try {
      return structuredClone(data);
    } catch (error) {
      // If structuredClone fails (e.g., with Proxy objects), use JSON serialization
      if (DEV_MODE && !NO_PROXY_LOGS) {
        console.warn(
          "[ObjectReshape] structuredClone failed, using JSON serialization fallback:",
          error,
        );
      }
      return JSON.parse(JSON.stringify(data));
    }
  }

  #init() {
    this.#isArray = this.#isValidArray(this.#dataSource);
    this.#isPlainObject = this.#isValidObject(this.#dataSource);
    this.#firstSourceElement = (this.#dataSource as T[])[0];
    this.#initShapedItem();
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

  /**
   * Transforms an object with dynamic keys containing arrays into an array of groups.
   * Each entry becomes an object with specified keys for the group name and items.
   *
   * @example
   * Input: { "Bac Pro": [{...}], "BTS": [{...}] }
   * .transformTuplesToGroups("groupTitle", "items")
   * Output: [{ groupTitle: "Bac Pro", items: [{...}] }, { groupTitle: "BTS", items: [{...}] }]
   *
   * @param groupKeyName - The key name for the group identifier (e.g., "groupTitle")
   * @param itemsKeyName - The key name for the array of items (e.g., "items")
   */
  transformTuplesToGroups(groupKeyName: string, itemsKeyName: string) {
    if (this.#isPlainObject) {
      const result: Array<Record<string, unknown>> = [];

      for (const [key, value] of Object.entries(this.#dataSource)) {
        const clonedItems = Array.isArray(value)
          ? value.map((item) =>
              typeof item === "object" && item !== null ? { ...item } : item,
            )
          : value;

        result.push({
          [groupKeyName]: key,
          [itemsKeyName]: clonedItems,
        });
      }

      this.#newShapedItem = result;
    }
    return this;
  }

  /**
   * Creates a computed property that joins multiple source keys with a separator.
   * The value is computed dynamically for each item when accessed via proxy.
   *
   * @example
   * ```ts
   * .createPropertyWithContentFromKeys(["degreeLevel", "degreeYear"], "description")
   * // For item { degreeLevel: "Bac", degreeYear: "2024" }
   * // Accessing "description" returns "Bac 2024"
   * ```
   *
   * @param keys - Source keys to join
   * @param output - Target property name
   * @param separator - Separator between values (default: " ")
   */
  createPropertyWithContentFromKeys(
    keys: string[],
    outputKey: string,
    separator = " ",
  ) {
    this.#computedProperties.set(outputKey, (item) => {
      return keys
        .map((key) => item[key])
        .filter((v) => v !== undefined && v !== null && v !== "")
        .join(separator);
    });
    return this;
  }

  /**
   * Creates a computed property with a fixed content value.
   * @example
   * ```ts
   * .setProxyPropertyWithContent("role", "Student")
   * // Accessing "role" returns "Student"
   * ```
   * @param key - Target property name
   * @param content - Fixed content value
   */
  setProxyPropertyWithContent(key: string, content: string) {
    this.#computedProperties.set(key, () => content);
    return this;
  }

  /**
   * Sets the current selection to the data source for further shaping.
   */
  assignSourceTo(key: string) {
    this.#initShapedItem();
    // Clone the provided data source for shaping as we don't want to mutate the
    // original input passed by the caller.
    const clonedSource = structuredClone(this.#dataSource);
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
    pairs: Array<[string, ...string[]] | { target: string; sources: string[] }>,
  ) {
    this.#initShapedItem();
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

  addToRoot(pairs: Record<string, unknown>) {
    this.#initShapedItem();
    // Always add at the top-level of the newly built shape. To add to the
    // items of an assigned source, use `addToItems()`.
    for (const key in pairs) {
      this.#newShapedItem[key] = pairs[key];
    }
    return this;
  }

  /**
   * Adds a new item to a specified group in the data source.
   * If the group does not exist, it creates a new group corresponding to the condition.
   *
   * @param newItem - The new item to add
   * @param itemsKey - The key for the items array (default: "items")
   * @param groupConditionKey - The key to identify the group (e.g., "groupTitle")
   * @param groupConditionValue - The value to match for the group
   */
  addTo(
    newItem: Record<string, unknown>,
    itemsKey = "items",
    groupConditionKey?: string,
    groupConditionValue?: string,
  ) {
    let jobDone = false;

    this.#newShapedItem = this.#dataSource.reduce((acc, curr) => {
      if (curr[groupConditionKey] === groupConditionValue) {
        curr[itemsKey] = [...curr[itemsKey], newItem];
        jobDone = true;
      }

      return acc;
    }, this.#dataSource);

    if (!jobDone) {
      const item = {
        [groupConditionKey]: groupConditionValue,
        [itemsKey]: [newItem],
      };

      this.#newShapedItem.push(item);
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
    excludeKey?: string,
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
   * Selects elements from the data source based on a key and assigns them to a new key.
   * Iterates through keys in order to build each item, with later keys overwriting earlier ones.
   *
   * @param keys - Array of keys to select elements from (in order of priority)
   * @param to - The key to assign the selected elements to
   *
   * @example
   * ```ts
   * const previousData = [
   *   {
   *     id: "root-id",
   *     task: { id: "task-id", name: "Task Name", description: "Task Description" }
   *   }
   * ]
   * // First spreads "task" content, then overwrites with root-level "id"
   * .selectElementsTo(["task", "id"], "items")
   * ```
   * @output
   * ```ts
   * {
   *   items: [
   *     { id: "root-id", name: "Task Name", description: "Task Description" }
   *   ]
   * }
   * ```
   */
  selectElementsTo(keys: string[], to: string) {
    const resultItems: Record<string, unknown>[] = [];

    for (const sourceItem of this.#dataSource as T[]) {
      let builtItem: Record<string, unknown> = {};

      // !! IMPORTANT !! Order of keys matters here - each key can add or overwrite properties
      for (const key of keys) {
        if (Object.hasOwn(sourceItem, key)) {
          const value = sourceItem[key];

          // If the value is an object (not array), spread its properties into builtItem
          if (value && typeof value === "object" && !Array.isArray(value)) {
            builtItem = { ...builtItem, ...value };
          } else {
            // For primitive values, add them directly with the key name
            builtItem[key] = value;
          }
        }
      }

      resultItems.push(builtItem);
    }

    this.#newShapedItem = {
      ...this.#newShapedItem,
      [to]: resultItems,
    };
    return this;
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
    sourceKeys: string[],
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
    target: Record<string, unknown>,
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
   * Applies computed properties to the target object.
   * Each computed property is evaluated using the source item's data.
   *
   * @param source - The source item to compute values from
   * @param target - The target object to add computed properties to
   */
  #applyComputedProperties(
    source: Record<string, unknown>,
    target: Record<string, unknown>,
  ): void {
    for (const [key, computeFn] of this.#computedProperties.entries()) {
      target[key] = computeFn(source);
    }
  }

  /**
   * Builds a single item with all mappings and additions applied.
   *
   * @param item - The source item to transform
   * @returns A new object with mappings and additions applied
   */
  buildItem(item: Record<string, unknown>): Record<string, unknown> {
    const newItem: Record<string, unknown> = { ...item };
    this.#applyMappings(item, newItem);
    this.#applyComputedProperties(item, newItem);
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
    sourceArray: Array<Record<string, unknown>>,
  ): Array<Record<string, unknown>> {
    return sourceArray.map((item) => this.buildItem(item));
  }

  /**
   * Builds the final shape by physically creating new objects with mapped keys.
   * This is the recommended method when the result will be stored in a cache
   * (like React Query) as proxies don't survive serialization.
   *
   * @returns A new object with all mappings applied as real properties
   */
  build(): Record<string, unknown>[] {
    // If dataSource is an array (e.g., after transformTuplesToGroups), process each group
    if (Array.isArray(this.#dataSource) && this.#dataSource.length > 0) {
      // Check if this looks like a transformed groups array
      const firstItem = this.#dataSource[0];
      if (
        firstItem &&
        typeof firstItem === "object" &&
        !this.#assignedSourceKey
      ) {
        // Apply mappings to each group and their items
        return this.#dataSource.map((group) => {
          const transformedGroup = { ...group };
          this.#applyMappings(group, transformedGroup);

          // If the group has an items array, apply mappings to each item
          for (const key in transformedGroup) {
            if (Array.isArray(transformedGroup[key])) {
              transformedGroup[key] = this.#buildItemsArray(
                transformedGroup[key],
              );
            }
          }

          return transformedGroup;
        });
      }
    }

    // Original behavior for assignSourceTo() pattern
    const result = this.#copyObjectExcluding(
      this.#newShapedItem,
      this.#assignedSourceKey,
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
    handler: ProxyHandler<Record<string, unknown>>,
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
          handler,
        );
      }
    }

    return new Proxy(obj as Record<string, unknown>, handler) as unknown as T;
  }

  #handler(): ProxyHandler<Record<string, unknown>> {
    return {
      ownKeys: (target: Record<string, unknown>) => {
        const keys = new Set(Reflect.ownKeys(target));

        // Add mapped keys
        for (const key of this.#mappingProxies.keys()) {
          keys.add(key);
        }

        // Add computed property keys
        for (const key of this.#computedProperties.keys()) {
          keys.add(key);
        }

        return Array.from(keys);
      },
      getOwnPropertyDescriptor: (
        target: Record<string, unknown>,
        prop: string | symbol,
      ) => {
        // !! IMPORTANT !! Check if the property exists directly on the target first
        const directDescendant = Reflect.getOwnPropertyDescriptor(target, prop);
        if (directDescendant) {
          return directDescendant;
        }

        // Then check for mapped properties
        if (typeof prop === "string") {
          const sourceKeys = this.#mappingProxies.get(prop);
          if (sourceKeys) {
            const resolved = this.#resolveValue(target, sourceKeys);
            if (resolved) {
              const desc = Reflect.getOwnPropertyDescriptor(
                target,
                resolved.sourceKey,
              );
              if (desc) {
                Reflect.set(target, "__isProxyfied", true);
                return { ...desc, enumerable: true, configurable: true };
              }
            }
          }
        }
        return Reflect.getOwnPropertyDescriptor(target, prop);
      },
      get: (
        target: Record<string, unknown>,
        prop: string | symbol,
        receiver: unknown,
      ): unknown => {
        if (typeof prop === "string") {
          // !! IMPORTANT !! Check if the property exists directly on the target first
          if (Object.hasOwn(target, prop)) {
            return Reflect.get(target, prop, receiver);
          }

          // mappingProxies stores targetKey -> sourceKeys[]
          const sourceKeys = this.#mappingProxies.get(prop);

          if (sourceKeys) {
            // First try to resolve from actual properties on target
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
                  resolved.value,
                );
              }
              Reflect.set(target, "__isProxyfied", true, receiver);
              return resolved.value;
            }

            // If not found on target, check if any source key is a computed property
            for (const sourceKey of sourceKeys) {
              const sourceComputeFn = this.#computedProperties.get(sourceKey);
              if (sourceComputeFn) {
                const computedValue = sourceComputeFn(target);
                if (DEV_MODE && !NO_PROXY_LOGS) {
                  console.debug(
                    "GET trap called for mapped prop:",
                    prop,
                    "resolved to computed source:",
                    sourceKey,
                    "with value:",
                    computedValue,
                  );
                }
                Reflect.set(target, "__isProxyfied", true, receiver);
                return computedValue;
              }
            }
          }
        }

        return Reflect.get(target, prop, receiver);
      },
      set: (
        target: Record<string, unknown>,
        prop: string | symbol,
        value: unknown,
        receiver: unknown,
      ): boolean => {
        if (DEV_MODE && !NO_PROXY_LOGS) {
          console.log(
            "SET EARLY trap called for prop:",
            prop,
            "with value:",
            value,
          );
        }

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
        "rename() can only be used if #dataSource is a plain object",
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
    let isEmpty;

    if (!Array.isArray(this.#newShapedItem)) {
      isEmpty =
        !this.#newShapedItem || Object.keys(this.#newShapedItem).length === 0;
      this.#newShapedItem = [this.#newShapedItem];
    }

    const data = isEmpty ? this.#dataSource : this.#newShapedItem;

    return this.deepProxy(data, this.#handler());
  }

  #initShapedItem() {
    if (this.#newShapedItem === null) this.#newShapedItem = {};
  }
}
