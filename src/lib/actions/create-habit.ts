"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { Status } from "@/app/enums";
import { CreateHabitState } from "@/app/(dashboard)/dashboard/create/types";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert } from "@/lib/supabase/database.types";
import { CreateSchemaServer, createSchemaServer } from "@/app/(dashboard)/dashboard/_utils/schema-server";

export async function createHabit(prevState: CreateHabitState, formData: CreateSchemaServer): Promise<CreateHabitState> {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value || "Europe/Prague";

  const validation = createSchemaServer.safeParse({ ...formData, timezone });

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

  const {
    date_range: { start_date, end_date },
    ...validationData
  } = validation.data;

  const habitInsertPayload: TablesInsert<"habits"> = {
    id: uuidv4(),
    user_id: user.id,
    name: validationData.name,
    description: validationData.description,
    type: validationData.type,
    target_count: validationData.target_count,
    days_of_week: validationData.days_of_week,
    // Dates are serialized as strings from the server, hence typecasting them to string
    start_date: start_date as unknown as string,
    end_date: end_date ? (end_date as unknown as string) : null,
    timezone: timezone,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error: dbError } = await supabase.from("habits").insert([habitInsertPayload]);

  if (dbError) {
    return {
      ...prevState,
      status: Status.DATABASE_ERROR,
      dbError: dbError,
    };
  }

  revalidatePath("/dashboard", "layout");

  return {
    ...prevState,
    status: Status.SUCCESS,
  };
}
