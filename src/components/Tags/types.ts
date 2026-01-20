export type DynamicTagItemDetails = {
  id: string;
  [key: string]: unknown;
};

export type DynamicTagsState = DynamicTagItemDetails & { isExiting?: boolean };

export type DynamicTagProps = {
  onExitComplete?: (value: string) => void;
  itemDetails?: DynamicTagsState;
  value?: string;
} & DynamicTagsSetters;

export type DynamicTagItemList =
  | Readonly<Record<string, DynamicTagItemDetails>>
  | ReadonlyArray<readonly [unknown, DynamicTagItemDetails]>;

type DynamicTagsSetters = {
  onRemove?: (value: string, details?: DynamicTagItemDetails) => void;
  setRef?: (node?: Element | null, meta?: Record<string, unknown>) => void;
  observedRefs?: {
    get: (key: string | undefined) => { element?: Element | null } | undefined;
  };
};

export type DynamicTagsProps = DynamicTagsSetters & {
  pageId?: string;
  title?: string;
  itemList: DynamicTagItemList;
  onRemove?: (value: string, details?: DynamicTagItemDetails) => void;
} & Record<string, unknown>;

export type DynamicTagState = {
  selected: boolean;
  role: string;
  isEditing: boolean;
  isEdited: boolean;
  prevText: string;
  newText: string;
  selectedText: string;
  itemDetails?: DynamicTagItemDetails;
};
