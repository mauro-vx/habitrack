"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { Status } from "@/app/enums";
import { UserProfile } from "@/app/(public)/profile/types";
import { EditProfileState } from "@/app/(public)/profile/types";
import { updateUserProfileSchema } from "@/app/(public)/profile/schema";
import { createClient } from "@/lib/supabase/server";

export async function updateUserProfile(
  prevState: EditProfileState,
  formData: { fullName: UserProfile["full_name"]; username: UserProfile["username"]; avatar?: File },
): Promise<EditProfileState> {
  const validation = updateUserProfileSchema.safeParse(formData);

  if (!validation.success) {
    return {
      ...prevState,
      status: Status.VALIDATION_ERROR,
      validationErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { fullName, username, avatar } = validation.data;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const changes: {
    id: string;
    avatar_url?: string;
    full_name?: string;
    username?: string;
    updated_at?: string;
  } = { id: user.id };

  if (avatar) {
    const fileExtension = avatar.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const { error: storageError } = await supabase.storage.from("avatars").upload(fileName, avatar);

    if (storageError) {
      return {
        ...prevState,
        status: Status.STORAGE_ERROR,
        storageError: storageError,
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
      status: Status.VALIDATION_ERROR,
      noEdits: "No changes were made.",
      fullName: prevState.fullName,
      username: prevState.username,
      avatarPublicUrl: prevState.avatarPublicUrl,
    };
  }

  changes.updated_at = new Date().toISOString();

  const { error: dbError } = await supabase.from("profiles").upsert(changes);

  if (dbError) {
    return {
      status: Status.DATABASE_ERROR,
      dbError: dbError,
      fullName: prevState.fullName,
      username: prevState.username,
      avatarPublicUrl: prevState.avatarPublicUrl,
    };
  }

  revalidatePath("/profile", "page");
  redirect("/profile");
}
