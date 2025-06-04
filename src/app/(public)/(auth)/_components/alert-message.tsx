import * as React from "react";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertMessage({
  title = "Error",
  icon: Icon = AlertCircle,
  error,
}: {
  title?: string;
  icon?: React.ElementType;
  error?: string;
}) {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
