import type { FetchingInputItem } from "@/components/Inputs/types/inputs.types.ts";
import z from "zod";

const attendance = {
  present: "present",
  absent: "absent",
};

const dataField = {
  studentValidUuidMessage: "L'identifiant de l'élève doit être un UUID valide.",
  statusValidMessage: "Le statut doit être 'present' ou 'absent'.",
  status: [attendance.present, attendance.absent],
  taskIdValidMessage: "L'identifiant de la tâche doit être un UUID valide.",
  taskNameMaxMessage: "Le nom de la tâche ne peut pas dépasser 64 caractères.",
  presenceValidationMessage:
    "Les champs 'taskId' et 'taskName' sont requis lorsque le statut est 'présent'.",
  taskIdMembershipMessage:
    "La tâche sélectionnée n'appartient pas à la classe.",
};

const attendanceRecordCreationSchema = (
  data: typeof dataField,
  availableTaskIds: string[] = [],
) =>
  z.object({
    students: z
      .array(
        z
          .object({
            studentId: z.uuid(data.studentValidUuidMessage),
            name: z.string().optional(),
            status: z.enum(data.status, {
              message: data.statusValidMessage,
            }),
            taskId: z.uuid(data.taskIdValidMessage).optional(),
            taskName: z
              .string()
              .max(64, data.taskNameMaxMessage)
              .trim()
              .optional(),
          })
          .superRefine((obj, ctx) => {
            if (obj.status === attendance.present) {
              if (!obj.taskId) {
                ctx.addIssue({
                  code: "custom",
                  path: ["taskId"],
                  message: data.presenceValidationMessage,
                });
              }
              if (!obj.taskName?.trim()) {
                ctx.addIssue({
                  code: "custom",
                  path: ["taskName"],
                  message:
                    "Le nom de la tâche est requis lorsque l'élève est présent.",
                });
              }
              if (
                obj.taskId &&
                availableTaskIds.length > 0 &&
                !availableTaskIds.includes(obj.taskId)
              ) {
                ctx.addIssue({
                  code: "custom",
                  path: ["taskId"],
                  message: data.taskIdMembershipMessage,
                });
              }
            }
          }),
      )
      .nonoptional(),
  });

/**
 * Factory function to create an instance of the attendance record creation schema.
 *
 * @param data - Data field containing validation messages and options.
 * @param availableTaskIds - List of available task IDs for validation.
 * @returns Zod schema for attendance record creation.
 */
export const attendanceRecordCreationSchemaInstance = (
  availableTaskIds: string[] = [],
) => attendanceRecordCreationSchema(dataField, availableTaskIds);

/**
 * References what informations are required for creating the Input Select component.
 */
export type AttendanceRecordCreationInputItem =
  FetchingInputItem<AttendanceRecordCreationFormSchema>;

/**
 * Schema type for ZOD, corresponding to the attendance record creation form.
 */
export type AttendanceRecordCreationFormSchema = z.infer<
  ReturnType<typeof attendanceRecordCreationSchemaInstance>
>;
