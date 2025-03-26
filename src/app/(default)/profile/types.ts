import type { User, PostgrestError } from "@supabase/supabase-js";
import { StorageError } from "@supabase/storage-js";

export interface UserProfile {
  id: User["id"];
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  publicUrl: string;
}

type Status = string;

interface EditFormErrors {
  fullName?: string[];
  username?: string[];
  avatar?: string[];
}

type ServerError = StorageError;

export interface EditProfileState {
  fullName: UserProfile["full_name"];
  username: UserProfile["username"];
  avatarPublicUrl: UserProfile["publicUrl"];
  avatar?: File;
  noEdits?: string;
  status?: Status;
  formErrors?: EditFormErrors;
  bucketError?: ServerError | null;
  serverError?: PostgrestError | null;
}
