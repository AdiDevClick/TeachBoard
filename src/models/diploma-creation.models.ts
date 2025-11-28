import z from "zod";

export const diplomaCreationSchema = z.object({
  diploma: z.string().min(1, "Le diplôme est requis."),
  schoolYear: z.string().min(1, "L'année scolaire est requise."),
  schoolLevel: z.string().min(1, "Le niveau scolaire est requis."),
  mainSkills: z.array(z.uuid()).optional(),
});
