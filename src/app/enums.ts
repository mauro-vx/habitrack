export enum ErrorStatus {
  FORM_ERROR = "form-error",
  SERVER_ERROR = "server-error",
}

export enum Status {
  SUCCESS = "success",

  VALIDATION_ERROR = "validation-error",

  SERVER_ERROR = "server-error",

  AUTH_ERROR = "supabase-auth-error",
  DATABASE_ERROR = "supabase-database-error",
  STORAGE_ERROR = "supabase-storage-error",
}

export enum HabitType {
  DAILY = "daily",
  WEEKLY = "weekly",
  CUSTOM = "custom",
}

export enum HabitStatus {
  PENDING = "pending",
  PROGRESS = "progress",
  DONE = "done",
  SKIP = "skip",
  INCOMPLETE = "incomplete",
}
