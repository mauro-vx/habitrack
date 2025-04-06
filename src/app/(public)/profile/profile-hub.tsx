import { UserProfile } from "./types";
import ProfileModeWrapper from "./profile-mode-wrapper";
import ProfileView from "./profile-view";
import ProfileEdit from "./profile-edit-form";

export default function ProfileHub({ userProfile }: { userProfile: UserProfile }) {
  return (
    <ProfileModeWrapper
      view={<ProfileView userProfile={userProfile} />}
      edit={<ProfileEdit userProfile={userProfile} />}
    />
  );
}
