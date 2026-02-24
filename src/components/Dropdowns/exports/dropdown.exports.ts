import { Dropdown } from "@/components/Dropdowns/Dropdown";
import withListMapper from "@/components/HOCs/withListMapper";
/**
 * @fileoverview This file is used to export all dropdown related components and utilities.
 * It serves as a central point for importing dropdown components across the app.
 */

/**
 * A version of the Dropdown component that is mapped to a list of items.
 */
export const DropdownList = withListMapper(Dropdown);
