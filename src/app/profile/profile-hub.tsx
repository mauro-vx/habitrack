import { UserProfile } from "@/app/profile/types";
import ProfileModeWrapper from "@/app/profile/profile-mode-wrapper";
import ProfileView from "@/app/profile/profile-view";
import ProfileEdit from "@/app/profile/profile-edit";

export default function ProfileHub({ userProfile }: { userProfile: UserProfile }) {
  return (
    <ProfileModeWrapper
      view={<ProfileView userProfile={userProfile} />}
      edit={<ProfileEdit userProfile={userProfile} />}
    />
  );
}
