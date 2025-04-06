"use client";

import * as React from "react";

import Link from "next/link";
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

const initState: SignInState = {
  email: "",
  password: "",
};

export default function SignInForm() {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col space-y-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-4xl font-bold">Sign in</h2>
          <Button asChild variant="ghost" className="text-brand text-lg">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>

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

        <AlertMessage error={state?.dbError} />
      </form>
    </Form>
  );
}
