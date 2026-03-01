import type { ChildrenMode } from "@/components/Lists/types/ListsTypes";
import type { AnyObjectProps } from "@/utils/types/types.utils";

// Module augmentation: add overload signatures to the existing component
// module without exporting any new runtime values.  Because this is an
// augmentation the overloads are *not* treated as exports of the
// implementation file, so Fast Refresh remains happy.
declare module "@/components/Lists/ListMapper" {
  // export function ListMapper<
  //   TItems extends readonly unknown[] | AnyObjectProps,
  //   TOptionalInput = undefined,
  // >(props: ChildrenFunctionMode<TItems, TOptionalInput>): ReactNode;

  export function ListMapper<
    TItems extends readonly unknown[] | AnyObjectProps,
    TOptionalInput = undefined,
  >(props: ChildrenMode<TItems, TOptionalInput>): ReactNode;
}
