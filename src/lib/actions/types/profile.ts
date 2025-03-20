import { StorageError } from "@supabase/storage-js";
import { PostgrestError } from "@supabase/supabase-js";
import { UserProfile } from "@/app/profile/types";

type Status = string;

interface EditFormErrors {
  fullName?: string[];
  username?: string[];
  avatar?: string[];
}

type ServerError = StorageError;

export interface EditProfileState {
  fullName: UserProfile["full_name"];
  username:  UserProfile["username"];
  avatarPublicUrl:  UserProfile["publicUrl"];
  avatar?: File;
  noEdits?: string;
  status?: Status;
  formErrors?: EditFormErrors;
  bucketError?: ServerError | null;
  serverError?:  PostgrestError | null;
}
