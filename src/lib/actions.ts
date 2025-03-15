"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/app/schemas/auth";

export async function signIn(
  prevState: { status: string; errors?: { email?: string[]; password?: string[] }; message?: string } | undefined,
  formData: { email: string; password: string },
) {
  const validatedFields = signInSchema.safeParse(formData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return { status: "error", errors };
  }

  const { email, password } = validatedFields.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: error.message || "Invalid email or password." };
  }

  redirect("/");
}

export async function signUp(
  prevState:
    | {
        status: string;
        errors?: { email?: string[]; chose_password?: string[]; verify_password?: string[] };
        message?: string;
      }
    | undefined,
  formData: { email: string; chose_password: string; verify_password: string },
) {
  const validatedFields = signUpSchema.safeParse(formData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return { status: "error", errors };
  }

  const { email, chose_password: password } = validatedFields.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { status: "error", message: error.message || "Invalid email or password." };
  }

  redirect("/verification-sent");
}

export async function signOut() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/");
}
