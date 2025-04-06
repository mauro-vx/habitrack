import { AuthError } from "@supabase/auth-js";
import { Status } from "@/app/enums";

interface SignInFormErrors {
  email?: string[];
  password?: string[];
}

interface SignUpFormErrors {
  email?: string[];
  setPassword?: string[];
  verifyPassword?: string[];
}

export interface SignInState {
  email: string;
  password: string;
  status?: Status;
  validationErrors?: SignInFormErrors;
  dbError?: AuthError;
}

export interface SignUpState {
  email: string;
  setPassword: string;
  verifyPassword: string;
  status?: Status;
  validationErrors?: SignUpFormErrors;
  dbError?: AuthError;
}
