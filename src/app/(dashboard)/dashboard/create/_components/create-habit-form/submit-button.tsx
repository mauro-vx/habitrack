import React from "react";

import { Button } from "@/components/ui/button";

export function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Creating..." : "Create Habit"}
    </Button>
  );
}
