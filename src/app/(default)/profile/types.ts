import type { User, PostgrestError } from "@supabase/supabase-js";
import { StorageError } from "@supabase/storage-js";
import { Status } from "@/app/enums";

export interface UserProfile {
  id: User["id"];
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  publicUrl: string;
}

interface EditFormErrors {
  fullName?: string[];
  username?: string[];
  avatar?: string[];
}

export interface EditProfileState {
  fullName: UserProfile["full_name"];
  username: UserProfile["username"];
  avatarPublicUrl: UserProfile["publicUrl"];
  avatar?: File;
  noEdits?: string;
  status?: Status;
  validationErrors?: EditFormErrors;
  storageError?: StorageError | null;
  dbError?: PostgrestError | null;
}
