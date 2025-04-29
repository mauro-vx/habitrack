import { UserProfile } from "./types";
import ProfileModeWrapper from "./profile-mode-wrapper";
import { ProfileView } from "./profile-view";
import { ProfileEditForm } from "./profile-edit-form";

export function ProfileHub({ userProfile }: { userProfile: UserProfile }) {
  return (
    <ProfileModeWrapper
      view={<ProfileView userProfile={userProfile} />}
      edit={<ProfileEditForm userProfile={userProfile} />}
    />
  );
}
