import { UserProfile } from "./types";
import { ProfileAvatar } from "./provile-avatar";

export function ProfileView({ userProfile }: { userProfile: UserProfile }) {
  return (
    <div className="flex flex-col gap-4">
      <ProfileAvatar userProfile={userProfile} alt="User's avatar" size={150} />

      <div className="space-y-2">
        <label>Full Name:</label>
        <p className="text-gray-700">{userProfile.full_name || "No full name available"}</p>
      </div>

      <div className="space-y-2">
        <label>Username:</label>
        <p className="text-gray-700">{userProfile.username || "No username available"}</p>
      </div>
    </div>
  );
}
