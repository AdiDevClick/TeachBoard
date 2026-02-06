import type { PopoverItem } from "@/hooks/types/use-popover-CRUD.types.ts";
import type { AnyObjectProps } from "@/utils/types/types.utils";
import type { UniqueSet } from "@/utils/UniqueSet";

export type DynamicTagItemDetails = {
  id: string;
} & AnyObjectProps;

export type StateDetails = {
  isExiting?: boolean;
} & DynamicTagItemDetails;

export type DynamicTagsState = UniqueSet<string, StateDetails>;

export type DynamicItemTuple = readonly [string, DynamicTagItemDetails];

export type DynamicTagProps = PopoverItem & {
  onExitComplete?: (value: string) => void;
  displayCRUD?: boolean;
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
  } & DynamicTagProps
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
