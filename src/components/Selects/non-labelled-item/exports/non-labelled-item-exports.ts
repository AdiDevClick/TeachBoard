import withListMapper from "@/components/HOCs/withListMapper";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem";

/**
 * This file serves as a central export point for the NonLabelledGroupItem component and its related types and utilities. It allows for cleaner imports in other parts of the application by consolidating all exports related to the NonLabelledGroupItem in one place.
 */

/**
 * A version that is enhanced with list mapping capabilities, allowing it to be used in contexts where a list of items needs to be rendered.
 */
export const NonLabelledGroupItemList = withListMapper(NonLabelledGroupItem);
