"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Status } from "@/app/enums";
import { SignInState, SignUpState } from "@/app/(public)/(auth)/types";
import { SignInSchema, signInSchema, signUpSchema } from "@/app/(public)/(auth)/schema";
import { createClient } from "@/lib/supabase/server";

export async function signIn(prevState: SignInState, formData: SignInSchema): Promise<SignInState> {
  const validation = signInSchema.safeParse(formData);

  if (!validation.success) {
    return {
      ...prevState,
      status: Status.VALIDATION_ERROR,
      validationErrors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error: dbError } = await supabase.auth.signInWithPassword(validation.data);

  if (dbError) {
    console.error("Sign-in error:", dbError);

    return {
      ...prevState,
      status: Status.DATABASE_ERROR,
      dbError: "An error occurred. Please try again.",
    };
  }

  redirect("/dashboard");
}

export async function signUp(
  prevState: SignUpState,
  formData: { email: string; setPassword: string; verifyPassword: string },
): Promise<SignUpState> {
  const validation = signUpSchema.safeParse(formData);

  if (!validation.success) {
    return {
      status: Status.VALIDATION_ERROR,
      validationErrors: validation.error.flatten().fieldErrors,
      email: prevState.email,
      setPassword: prevState.setPassword,
      verifyPassword: prevState.verifyPassword,
    };
  }

  const { email, setPassword: password } = validation.data;

  const supabase = await createClient();
  const { error: dbError } = await supabase.auth.signUp({ email, password });

  if (dbError) {
    console.error("Sign-up error:", dbError);

    if (dbError.message.includes("already registered")) {
      return {
        ...prevState,
        status: Status.DATABASE_ERROR,
        dbError: "This email is already registered.",
      };
    }

    return {
      ...prevState,
      status: Status.DATABASE_ERROR,
      dbError: "An error occurred. Please try again.",
    };
  }

  redirect("/verification-sent");
}

export async function signOut() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { error: dbError } = await supabase.auth.signOut();

  if (dbError) {
    return { status: Status.DATABASE_ERROR, serverError: "An error occurred. Please try again." };
  }

  try {
    revalidatePath("/", "layout");
  } catch (revalidateError) {
    console.error("Error revalidating dashboard path:", revalidateError);
  }

  redirect("/");
}
