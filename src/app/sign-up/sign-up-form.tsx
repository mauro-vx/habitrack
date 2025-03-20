"use client";

import * as React from "react";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";

import { type SignUpSchema, signUpSchema } from "@/lib/actions/schemas/auth";
import { signUp } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignUpForm() {
  const [state, formAction, isPending] = React.useActionState(signUp, {
    email: "",
    setPassword: "",
    verifyPassword: "",
  });

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      setPassword: "",
      verifyPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: SignUpSchema) {
    React.startTransition(() => formAction(data));

    if (state?.status === "form-error" && state.formErrors) {
      for (const [key, value] of Object.entries(state.formErrors)) {
        form.setError(key as keyof typeof state.formErrors, {
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
          <h2 className="text-4xl font-bold">Sign up</h2>
          <Button asChild variant="ghost" className="text-brand text-lg">
            <Link href="/sign-in">Sign in</Link>
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
              <FormDescription>Provide the email address you&#39;d like to sign up with.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="setPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chose a password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>Enter a secure password with at least 6 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="verifyPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verify password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Repeat the password" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>Re-enter the password to confirm your choice.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="self-end">
          {isPending ? "Signing up..." : "Sign Up"}
        </Button>

        {state?.serverError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.serverError.message || "Invalid email or password."}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}
