"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProfileModeWrapper({ view, edit }: { view: React.ReactNode; edit: React.ReactNode }) {
  const [mode, setMode] = React.useState<"view" | "edit">("view");

  const toggleMode = React.useCallback(() => {
    setMode((prevMode) => (prevMode === "view" ? "edit" : "view"));
  }, []);

  const isView = mode === "view";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold"> {mode === "view" ? "Profile" : "Edit"}</h1>

      <section className={cn("block", !isView && "hidden")}>{view}</section>
      <section className={cn("hidden", !isView && "block")}>{edit}</section>

      <Button variant="outline" onClick={toggleMode} className="self-end">
        {mode === "view" ? "Edit" : "Back"}
      </Button>
    </div>
  );
}
