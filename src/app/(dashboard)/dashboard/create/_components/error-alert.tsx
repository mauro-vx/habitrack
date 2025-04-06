import React from "react";

import { AlertCircle } from "lucide-react";
import { PostgrestError } from "@supabase/supabase-js";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export const ErrorAlert = ({ error }: { error?: PostgrestError | null }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message || "An error occurred."}</AlertDescription>
    </Alert>
  );
};
