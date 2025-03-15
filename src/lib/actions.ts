"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/app/schemas/auth";

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
    return { status: "error", message: "Invalid email or password." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    console.error("Invalid input data: Missing email or password");
    redirect("/error?signup_failed=true");
  }

  // Construct the data object
  const data = { email, password };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("SignUp error:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
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
