import { formsRegex } from "@/configs/formsRegex.config.ts";
import type { FetchingInputItem } from "@/types/AppInputControllerInterface";
import z from "zod";

const fieldData = {
  nameRequiredMessage:
    "Le sujet de l'événement est requis. Ex: 'Réunion de projet', 'Anniversaire'...",
  maxLength: 255,
  maxLengthExceededMessage:
    "Le sujet de l'événement ne peut pas dépasser 255 caractères.",
  nameRegexMessage:
    "Le sujet de l'événement ne doit pas contenir de caractères spéciaux.",
  descriptionRegexMessage:
    "La description de l'événement ne doit pas contenir de caractères spéciaux.",
  descriptionMaxLengthMessage:
    "La description de l'événement ne peut pas dépasser 500 caractères.",
  dateInvalidMessage:
    "Le format de la date est invalide. Utilisez le format YYYY-MM-DDTHH:mm (ex: 2024-12-31T14:30).",
  dateTimeInvalidMessage:
    "Le format de l'heure est invalide. Utilisez le format HH:mm (ex: 14:30).",
};

const schema = (data: typeof fieldData) =>
  z
    .object({
      subject: z
        .string()
        .min(1, data.nameRequiredMessage)
        .max(255, data.maxLengthExceededMessage)
        .trim()
        .regex(formsRegex.serverName, data.nameRegexMessage)
        .meta({ description: "Event Subject" }),
      isAllDay: z
        .boolean()
        .optional()
        .meta({ description: "Indicates if the event is an all-day event" }),
      date: z
        .object({
          single: z.iso
            .date(data.dateInvalidMessage)
            .nonempty()
            .meta({ description: "Optional, the date of the event" }),
          range: z
            .object({
              from: z.iso
                .date(data.dateInvalidMessage)
                .nonempty()
                .meta({ description: "Optional, the start date of the event" }),
              to: z.iso
                .date(data.dateInvalidMessage)
                .nonempty()
                .meta({ description: "Optional, the end date of the event" }),
            })
            .optional()
            .meta({ description: "Optional, the date range of the event" }),
        })
        .nonoptional()
        .meta({
          description: "Either a single date or a date range for the event",
        }),
      start: z.iso
        .time(data.dateTimeInvalidMessage)
        .optional()
        .meta({ description: "Optional, the start time of the event" }),
      end: z.iso
        .time(data.dateTimeInvalidMessage)
        .optional()
        .meta({ description: "Optional, the end time of the event" }),

      body: z
        .object({
          content: z
            .string()
            .trim()
            .max(500, data.descriptionMaxLengthMessage)
            .regex(formsRegex.serverDescription, data.descriptionRegexMessage)
            .optional()
            .meta({ description: "Optional event body" }),
        })
        .optional()
        .meta({
          description:
            "For Microsoft, content is wrapped inside the body object",
        }),
    })
    .superRefine((obj, ctx) => {
      const { start, end } = obj;
      if (!start || !end) return;

      if (end <= start) {
        ctx.addIssue({
          code: "custom",
          message: "L'heure de fin doit être supérieure à l'heure de début.",
          path: ["end"],
        });
        ctx.addIssue({
          code: "custom",
          message: "L'heure de début doit être inférieure à l'heure de fin.",
          path: ["start"],
        });
      }
    });

export const eventViewSchema = schema(fieldData);
export type EventViewFormSchema = z.infer<typeof eventViewSchema>;

export type EventViewInputItem = FetchingInputItem<EventViewFormSchema>;
