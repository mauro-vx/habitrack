"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Status } from "@/app/enums";
import { SignInState, SignUpState } from "@/app/(default)/(auth)/types";
import { SignInSchema, signInSchema, signUpSchema } from "@/app/(default)/(auth)/schema";
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
    return {
      ...prevState,
      status: Status.DATABASE_ERROR,
      dbError: dbError,
    };
  } else {
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
    return {
      ...prevState,
      status: Status.DATABASE_ERROR,
      dbError: dbError,
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
    return { status: Status.DATABASE_ERROR, serverError: dbError };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
