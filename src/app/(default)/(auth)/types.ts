import { ErrorStatus } from "@/app/enums";
import { ServerError } from "@/app/types";

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
  status?: ErrorStatus;
  formErrors?: SignInFormErrors;
  serverError?: ServerError;
}

export interface SignUpState {
  email: string;
  setPassword: string;
  verifyPassword: string;
  status?: ErrorStatus;
  formErrors?: SignUpFormErrors;
  serverError?: ServerError;
}
