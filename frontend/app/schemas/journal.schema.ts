import z from "zod";

export const JournalInfoSchema = z.object({
    id: z.number().optional(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    image_url: z.array(z.string()),
    updated_at: z.coerce.date().optional()
});

export const JournalListSchema = JournalInfoSchema.array();

export type JournalInfo = z.infer<typeof JournalInfoSchema>;
export type JournalList = z.infer<typeof JournalListSchema>;