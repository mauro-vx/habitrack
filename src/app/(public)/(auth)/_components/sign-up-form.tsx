"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Status } from "@/app/enums";
import { SignUpState } from "../types";
import { type SignUpSchema, signUpSchema } from "../schema";
import { signUp } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInputField from "../_components/form-input-field";
import AlertMessage from "../_components/alert-message";
import { cn } from "@/lib/utils";

const initState: SignUpState = {
  email: "",
  setPassword: "",
  verifyPassword: "",
};

export default function SignUpForm({
  headerSlot,
  footerSlot,
  className,
}: {
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, isPending] = React.useActionState(signUp, initState);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: initState,
    mode: "onChange",
  });

  async function onSubmit(data: SignUpSchema) {
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
            res="Provide the email address you'd like to sign up with."
            control={form.control}
            disabled={isPending}
          />

          <FormInputField
            name="setPassword"
            label="Choose a password"
            placeholder="Enter your password"
            type="password"
            res="Enter a secure password with at least 6 characters."
            control={form.control}
            disabled={isPending}
          />

          <FormInputField
            name="verifyPassword"
            label="Verify password"
            placeholder="Repeat the password"
            type="password"
            res="Re-enter the password to confirm your choice."
            control={form.control}
            disabled={isPending}
          />

          <Button type="submit" disabled={isPending} className="self-end">
            {isPending ? "Signing up..." : "Sign Up"}
          </Button>

          <AlertMessage error={state?.dbError} />
        </form>
      </Form>

      {footerSlot}

      <AlertMessage error={state?.dbError} />
    </div>
  );
}
