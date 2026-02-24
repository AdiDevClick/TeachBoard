/**
 * @fileoverview This file defines types for the useUserEventListener hook, which allows components to listen to user events on the window object.
 *
 * @description The main type defined here is WindowEventHandler, which represents a function that handles a specific type of window event. This type is used as the type for the optional callback function that can be passed to the useUserEventListener hook.
 *
 * @see useUserEventListener.ts for the implementation of the hook that utilizes these types.
 */

/**
 * Type definition for a window event handler function.
 */
export type WindowEventHandler<K extends keyof WindowEventMap> = (
  _event: WindowEventMap[K],
) => void;
