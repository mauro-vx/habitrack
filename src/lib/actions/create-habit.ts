"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { Status } from "@/app/enums";
import { CreateHabitState } from "@/app/(dashboard)/dashboard/create/types";
import { CreateHabitSchema, createHabitSchema } from "@/app/(dashboard)/dashboard/create/schema";
import { createClient } from "@/lib/supabase/server";

export async function createHabit(prevState: CreateHabitState, formData: CreateHabitSchema): Promise<CreateHabitState> {
  const validation = createHabitSchema.safeParse(formData);

  if (!validation.success) {
    return {
      ...prevState,
      status: Status.VALIDATION_ERROR,
      validationErrors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { error: dbError } = await supabase.from("habits").insert({
    user_id: user.id,
    id: uuidv4(),
    ...validation.data,
    created_at: new Date(),
    updated_at: new Date(),
  });

  if (dbError) {
    return {
      ...prevState,
      status: Status.DATABASE_ERROR,
      dbError: dbError,
    };
  }

  revalidatePath("/dashboard", "page");
  return {
    ...prevState,
    status: Status.SUCCESS,
  };
}
