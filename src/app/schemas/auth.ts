import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address."),
    chose_password: z.string().min(6, "Password must be at least 6 characters long."),
    verify_password: z.string().min(6, "Password must be at least 6 characters long."),
  })
  .refine((data) => data.chose_password === data.verify_password, {
    message: "Passwords do not match.",
    path: ["verify_password"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
