import * as React from "react";

import CreateHabitForm from "./create-habit-form";

export default function CreatePage() {
  return (
    <main className="container flex h-screen items-center justify-center">
      <CreateHabitForm className="grow" />
    </main>
  );
}
