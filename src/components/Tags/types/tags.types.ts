import type { PopoverItem } from "@/hooks/types/use-popover-CRUD.types.ts";

export type DynamicTagItemDetails = {
  id: string;
  [key: string]: unknown;
};

export type DynamicTagsState = DynamicTagItemDetails & { isExiting?: boolean };

export type DynamicItemTuple = readonly [string, DynamicTagItemDetails];

export type DynamicTagProps = PopoverItem & {
  onExitComplete?: (value: string) => void;
} & DynamicTagsSetters;

export type DynamicTagsItemList =
  | Readonly<Record<string, DynamicTagItemDetails>>
  | DynamicItemTuple[];

export type DynamicTagsSetters = {
  onRemove?: (value: string, details?: DynamicTagItemDetails) => void;
  setRef?: (node?: Element | null, meta?: Record<string, unknown>) => void;
  observedRefs?: {
    get: (key: string | undefined) => { element?: Element | null } | undefined;
  };
};

export type DynamicTagsProps = Readonly<
  DynamicTagsSetters & {
    pageId?: string;
    title?: string;
    itemList: DynamicTagsItemList;
  } & Record<string, unknown>
>;

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
