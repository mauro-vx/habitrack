"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { createClient } from "@/lib/supabase/server";
import { EditProfileState } from "@/lib/actions/types/profile";
import { updateUserProfileSchema } from "@/lib/actions/schemas/profile";
import { UserProfile } from "@/app/profile/types";

export async function updateUserProfile(
  prevState: EditProfileState,
  formData: { fullName: UserProfile["full_name"]; username: UserProfile["username"]; avatar?: File },
): Promise<EditProfileState> {
  const validatedFields = updateUserProfileSchema.safeParse(formData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      status: "form-error",
      formErrors: errors,
      fullName: prevState.fullName,
      username: prevState.username,
      avatarPublicUrl: prevState.avatarPublicUrl,
    };
  }

  const { fullName, username, avatar } = validatedFields.data;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const changes: Partial<UserProfile & { updated_at: string }> = { id: user.id };

  if (avatar) {
    const fileExtension = avatar.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const { error: bucketError } = await supabase.storage.from("avatars").upload(fileName, avatar);

    if (bucketError) {
      return {
        status: "server-error",
        bucketError: bucketError,
        fullName: prevState.fullName,
        username: prevState.username,
        avatarPublicUrl: prevState.avatarPublicUrl,
      };
    }

    changes.avatar_url = fileName;
  }

  if (username && username !== prevState.username) {
    changes.username = username;
  }

  if (fullName && fullName !== prevState.fullName) {
    changes.full_name = fullName;
  }

  if (Object.keys(changes).length === 1) {
    return {
      status: "form-error",
      noEdits: "No changes were made.",
      fullName: prevState.fullName,
      username: prevState.username,
      avatarPublicUrl: prevState.avatarPublicUrl,
    };
  }

  changes.updated_at = new Date().toISOString();

  const { error: serverError } = await supabase.from("profiles").upsert(changes);

  if (serverError) {
    return {
      status: "server-error",
      serverError: serverError,
      fullName: prevState.fullName,
      username: prevState.username,
      avatarPublicUrl: prevState.avatarPublicUrl,
    };
  }

  revalidatePath("/profile", "page");
  redirect("/profile");
}
