export type DynamicTagItemDetails = unknown;

export type DynamicTagItemList =
  | Readonly<Record<string, DynamicTagItemDetails>>
  | ReadonlyArray<readonly [unknown, DynamicTagItemDetails]>;

export type DynamicTagProps = {
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
