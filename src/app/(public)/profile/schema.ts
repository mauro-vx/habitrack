import { z } from "zod";

export const updateUserProfileSchema = z.object({
  fullName: z
    .string()
    .refine((val) => !val.endsWith(" "), {
      message: "Full name must not end with a space.",
    })
    .refine((val) => val.trim().split(" ").length >= 2, {
      message: "Full name must include at least a name and a surname.",
    }).nullable(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .refine((val) => !val.endsWith(" "), {
      message: "Username must not end with a space.",
    }).nullable(),
  avatar: z.instanceof(File).optional(),
});

export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema> & {
  noEdits?: string;
};
