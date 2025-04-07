"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Status } from "@/app/enums";
import { SignInState } from "../types";
import { type SignInSchema, signInSchema } from "../schema";
import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInputField from "../_components/form-input-field";
import AlertMessage from "../_components/alert-message";
import { cn } from "@/lib/utils";

const initState: SignInState = {
  email: "",
  password: "",
};

export default function SignInForm({
  headerSlot,
  footerSlot,
  className,
}: {
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, isPending] = React.useActionState(signIn, initState);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: initState,
    mode: "onChange",
  });

  async function onSubmit(data: SignInSchema) {
    React.startTransition(() => formAction(data));

    if (state?.status === Status.VALIDATION_ERROR && state.validationErrors) {
      for (const [key, value] of Object.entries(state.validationErrors)) {
        form.setError(key as keyof typeof state.validationErrors, {
          type: "manual",
          message: value?.[0] || "Invalid value",
        });
      }
    }
  }

  return (
    <div className={cn("flex w-full max-w-md flex-col", className)}>
      {headerSlot}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex flex-col space-y-2">
          <FormInputField
            name="email"
            label="Email"
            placeholder="example@example.com"
            type="email"
            res="Enter your email address."
            control={form.control}
            disabled={isPending}
          />

          <FormInputField
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            res="Enter your account password."
            control={form.control}
            disabled={isPending}
          />

          <Button type="submit" disabled={isPending} className="self-end">
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      {footerSlot}

      <AlertMessage error={state?.dbError} />
    </div>
  );
}
