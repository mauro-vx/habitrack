import * as React from "react";

import { AlertCircle } from "lucide-react";
import { AuthError } from "@supabase/auth-js";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlertMessage({
  title = "Error",
  icon: Icon = AlertCircle,
  error,
}: {
  title?: string;
  icon?: React.ElementType;
  error?: AuthError;
}) {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
