import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: User["id"];
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  publicUrl: string;
}
