/**
 * Type definitions for the properties accepted by the useDrawer hook
 */
export type UseDrawerProps = {
  /**
   * ID for the page/dialog, used for managing the state of the drawer in which the component using this hook is rendered.
   * @default "none"
   */
  pageId: AppDialogNames;
};
