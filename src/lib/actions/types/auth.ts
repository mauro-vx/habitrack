import { AuthError } from "@supabase/auth-js";

type Status = string;

interface SignInFormErrors {
  email?: string[];
  password?: string[];
}

interface SignUpFormErrors {
  email?: string[];
  setPassword?: string[];
  verifyPassword?: string[];
}

type ServerError = AuthError;

export interface SignInState {
  email: string;
  password: string;
  status?: Status;
  formErrors?: SignInFormErrors;
  serverError?: ServerError;
}

export interface SignUpState {
  email: string;
  setPassword: string;
  verifyPassword: string;
  status?: Status;
  formErrors?: SignUpFormErrors;
  serverError?: ServerError;
}
