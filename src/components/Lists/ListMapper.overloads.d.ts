import type { ChildrenMode } from "@/components/Lists/types/ListsTypes";
import type { AnyObjectProps } from "@/utils/types/types.utils";

declare module "@/components/Lists/ListMapper" {
  export function ListMapper<
    TItems extends AnyObjectProps | readonly unknown[],
    TOptionalInput = undefined,
  >(props: ChildrenMode<TItems, TOptionalInput>): ReactNode;
}
