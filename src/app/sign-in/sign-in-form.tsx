"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type SignInSchema, signInSchema } from "@/app/schemas/auth";
import { signIn } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function SignInForm() {
  const [state, formAction, isPending] = React.useActionState(signIn, undefined);

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: { email: string; password: string }) {
    React.startTransition(() => formAction(data));

    if (state?.status === "error") {
      if (state.errors) {
        for (const [key, value] of Object.entries(state.errors)) {
          form.setError(key as keyof typeof state.errors, {
            type: "manual",
            message: value?.[0] || "Invalid value",
          });
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <Button type="submit" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign In"}
        </Button>

        {state?.message && <div className="mb-4 text-red-500">{state.message}</div>}
      </form>
    </Form>
  );
}
