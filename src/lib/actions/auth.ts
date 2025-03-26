"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ErrorStatus } from "@/app/enums";
import { SignInState, SignUpState } from "@/app/(default)/(auth)/types";
import { signInSchema, signUpSchema } from "@/app/(default)/(auth)/schema";
import { createClient } from "@/lib/supabase/server";


export async function signIn(
  prevState: SignInState,
  formData: { email: string; password: string },
): Promise<SignInState> {
  const validatedFields = signInSchema.safeParse(formData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      status: ErrorStatus.FORM_ERROR,
      formErrors: errors,
      email: prevState.email,
      password: prevState.password,
    };
  }

  const { email, password } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      status: ErrorStatus.SERVER_ERROR,
      serverError: error,
      email: prevState.email,
      password: prevState.password,
    };
  }

  redirect("/");
}

export async function signUp(
  prevState: SignUpState,
  formData: { email: string; setPassword: string; verifyPassword: string },
): Promise<SignUpState> {
  const validatedFields = signUpSchema.safeParse(formData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      status: ErrorStatus.FORM_ERROR,
      formErrors: errors,
      email: prevState.email,
      setPassword: prevState.setPassword,
      verifyPassword: prevState.verifyPassword,
    };
  }

  const { email, setPassword: password } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return {
      status: ErrorStatus.SERVER_ERROR,
      serverError: error,
      email: prevState.email,
      setPassword: prevState.setPassword,
      verifyPassword: prevState.verifyPassword,
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

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { status: ErrorStatus.SERVER_ERROR, serverError: error };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
