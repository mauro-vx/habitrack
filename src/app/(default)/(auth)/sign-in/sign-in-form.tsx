"use client";

import * as React from "react";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";

import { Status } from "@/app/enums";
import { SignInState } from "@/app/(default)/(auth)/types";
import { type SignInSchema, signInSchema } from "../schema";
import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>Enter your email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>Enter your account password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="self-end">
          {isPending ? "Signing in..." : "Sign In"}
        </Button>

        {state?.dbError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.dbError.message || "Invalid email or password."}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}
