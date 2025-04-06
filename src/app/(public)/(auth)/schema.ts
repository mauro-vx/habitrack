import { z } from "zod";

const baseAuthSchema = z.object({
  email: z.string().email("Invalid email address."),
});

export const signInSchema = baseAuthSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export const signUpSchema = baseAuthSchema
  .extend({
    setPassword: z.string().min(6, "Password must be at least 6 characters long."),
    verifyPassword: z.string().min(6, "Password must be at least 6 characters long."),
  })
  .refine((data) => data.setPassword === data.verifyPassword, {
    message: "Passwords do not match.",
    path: ["verifyPassword"],
  });

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
