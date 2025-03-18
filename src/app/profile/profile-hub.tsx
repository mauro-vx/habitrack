import { cn } from "@/lib/utils";
import ProfileAvatar from "./provile-avatar";

export default function ProfileHub({
  profileData,
}: {
  profileData: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}) {
  return (
    <div className={cn("flex flex-col gap-4")}>
      <ProfileAvatar
        // uid={profileOld.id}
        avatar_url={profileData.avatar_url}
        alt="User's avatar"
        size={150}
      />

      <div>
        <label>Full Name:</label>
        <p className="text-gray-700">{profileData?.full_name || "No full name available"}</p>
      </div>

      <div>
        <label>Username:</label>
        <p className="text-gray-700">{profileData?.username || "No username available"}</p>
      </div>
    </div>
  );
}
