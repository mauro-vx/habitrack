"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

const MemoizedView = React.memo(({ children }: { children: React.ReactNode }) => {
  MemoizedView.displayName = "MemoizedView";
  return <>{children}</>;
});

const MemoizedEdit = React.memo(({ children }: { children: React.ReactNode }) => {
  MemoizedEdit.displayName = "MemoizedEdit";
  return <>{children}</>;
});

export default function ProfileModeWrapper({ view, edit }: { view: React.ReactNode; edit: React.ReactNode }) {
  const [mode, setMode] = React.useState<"view" | "edit">("view");

  const toggleMode = React.useCallback(() => {
    setMode((prevMode) => (prevMode === "view" ? "edit" : "view"));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold"> {mode === "view" ? "Profile" : "Edit"}</h1>
      {mode === "view" ? <MemoizedView>{view}</MemoizedView> : <MemoizedEdit>{edit}</MemoizedEdit>}
      <Button variant="outline" onClick={toggleMode} className="self-end">
        {mode === "view" ? "Edit" : "Back"}
      </Button>
    </div>
  );
}
