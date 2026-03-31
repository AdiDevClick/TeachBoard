/**
 * @fileoverview Point d'export central pour les composants Tables.
 */
import withListMapper from "@/components/HOCs/withListMapper";
import { Row } from "@/components/Tables/Row";

/**
 * A list of header groups to the Row component, allowing it to render the table headers.
 */
export const RowsList = withListMapper(Row<any>);
