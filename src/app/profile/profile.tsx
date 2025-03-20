import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import ProfileHub from "./profile-hub";

export default async function Profile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message || "Failed to fetch profileOld data.");
  }

  const {
    data: avatarData,
  } = supabase.storage.from("avatars").getPublicUrl(profileData.avatar_url);

  const userProfile = {
    id: user.id,
    ...avatarData,
    ...profileData,
  };

  return <ProfileHub userProfile={userProfile} />;
}
