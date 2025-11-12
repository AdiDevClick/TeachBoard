/** Utility type pour exclure automatiquement des props avec never */
export type ExcludeProps<T extends Record<string, unknown>> = {
  [K in keyof T]?: never;
};
