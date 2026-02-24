import type { UUID } from "@/api/types/openapi/common.types";
import type { UseMutationObserverReturn } from "@/hooks/types/use-mutation-observer.types.ts";
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

export type DynamicItemTuple = readonly [string | UUID, DynamicTagItemDetails];

export type DynamicTagProps = PopoverItem & {
  onExitComplete?: (value: string) => void;
  displayCRUD?: boolean;
} & DynamicTagsSetters;

export type DynamicTagsItemList =
  | Readonly<Record<string | UUID, DynamicTagItemDetails>>
  | DynamicItemTuple[];

export type DynamicTagsSetters = {
  onRemove?: (value: string, details?: DynamicTagItemDetails) => void;
} & UseMutationObserverReturn;

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
