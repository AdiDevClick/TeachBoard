/**
 * Verify the input type and return the corresponding field name
 *
 * @param fieldName
 */
export function switchFields(
  fieldName: string
): "diplomaFieldId" | "yearId" | "levelId" {
  switch (fieldName) {
    case "FIELD":
      return "diplomaFieldId";
    case "YEAR":
      return "yearId";
    case "LEVEL":
      return "levelId";
    default:
      return "diplomaFieldId";
  }
}
