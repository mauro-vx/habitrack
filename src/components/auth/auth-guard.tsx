import * as React from "react";

import { createClient } from "@/lib/supabase/server";

export async function AuthGuard({
  userStatus,
  children,
}: {
  userStatus: "signedIn" | "signedOut";
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const shouldRender = (userStatus === "signedIn" && user) || (userStatus === "signedOut" && !user);

  return <React.Fragment>{shouldRender ? children : null}</React.Fragment>;
}
