import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address."),
    setPassword: z.string().min(6, "Password must be at least 6 characters long."),
    verifyPassword: z.string().min(6, "Password must be at least 6 characters long."),
  })
  .refine((data) => data.setPassword === data.verifyPassword, {
    message: "Passwords do not match.",
    path: ["verifyPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
