/**
 * @fileoverview This file contains type definitions for the functional wrappers used in Step Three of the evaluation creation process.
 */

/**
 * Handle description change based on selected sub-skill
 */
export type DescriptionChangeProps = Readonly<{
  name?: string | null;
}>;
