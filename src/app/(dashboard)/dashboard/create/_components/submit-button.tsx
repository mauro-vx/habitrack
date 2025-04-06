import React from "react";

import { Button } from "@/components/ui/button";

export const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? "Creating..." : "Create Habit"}
  </Button>
);
