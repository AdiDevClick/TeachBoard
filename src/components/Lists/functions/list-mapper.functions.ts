/**
 * Utility function to retrieve the optional value, whether it's a static value or a function that returns a value based on the item and index.
 *
 * @param optional - The optional value or resolver function provided in the ListMapper props.
 * @param item - The current item being rendered in the list.
 * @param index - The index of the current item in the list.
 */
export function retrieveOptional<TItems, TOptional>(
  optional: TOptional | ((item: TItems, index: number) => TOptional),
  item: TItems,
  index: number,
): TOptional {
  if (typeof optional === "function") {
    return (optional as (item: TItems, index: number) => TOptional)(
      item,
      index,
    );
  }
  return optional;
}
