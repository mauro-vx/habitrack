"use client";

import * as React from "react";

import {  useRouter } from "next/navigation";

import { AuthMode } from "@/app/(public)/(auth)/enums";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignInForm from "@/app/(public)/(auth)/_components/sign-in-form";
import SignUpForm from "@/app/(public)/(auth)/_components/sign-up-form";

const authModeLabels = {
  [AuthMode.SignIn]: "Sign in",
  [AuthMode.SignUp]: "Sign up",
};

export default function DialogDemo() {
  const [authMode, setAuthMode] = React.useState<AuthMode>(AuthMode.SignIn);
  const router = useRouter();

  const isSignIn = authMode === AuthMode.SignIn;
  const otherAuthMode = isSignIn ? AuthMode.SignUp : AuthMode.SignIn;

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="sm:max-w-[425px] [&>button:last-child]:hidden"
        onEscapeKeyDown={handleClose}
        onPointerDownOutside={handleClose}
      >
        <DialogHeader>
          <div className="flex items-end justify-between">
            <DialogTitle className="text-4xl font-bold">{authModeLabels[authMode]}</DialogTitle>
            <Button
              variant="ghost"
              className="text-brand text-lg"
              onClick={() => {
                setAuthMode(otherAuthMode);
                window.history.replaceState(null, "", `/${otherAuthMode}`);
              }}
            >
              {authModeLabels[otherAuthMode]}
            </Button>
          </div>
        </DialogHeader>
        <SignInForm className={cn(!isSignIn && "hidden")} /> <SignUpForm className={cn(isSignIn && "hidden")} />
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
