"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { ErrorStatus } from "@/app/enums";
import { CreateHabitState } from "@/app/(dashboard)/dashboard/create/types";
import { CreateHabitSchema, createHabitSchema } from "@/app/(dashboard)/dashboard/create/schema";
import { createClient } from "@/lib/supabase/server";

export async function createHabit(prevState: CreateHabitState, formData: CreateHabitSchema): Promise<CreateHabitState> {
  const validation = createHabitSchema.safeParse(formData);

  if (!validation.success) {
    return {
      ...prevState,
      status: ErrorStatus.FORM_ERROR,
      formErrors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { error: serverError } = await supabase.from("habits").insert({
    user_id: user.id,
    id: uuidv4(),
    ...validation.data,
    created_at: new Date(),
    updated_at: new Date(),
  });

  if (serverError) {
    return {
      ...prevState,
      status: ErrorStatus.SERVER_ERROR,
      serverError: serverError,
    };
  }

  revalidatePath("/dashboard", "page");
  return prevState;
}
