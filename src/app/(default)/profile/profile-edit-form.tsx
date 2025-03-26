"use client";

import * as React from "react";

import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorStatus } from "@/app/enums";
import { UserProfile } from "./types";
import { type UpdateUserProfileSchema, updateUserProfileSchema } from "./schema";
import { cn } from "@/lib/utils";
import { updateUserProfile } from "@/lib/actions/profile";
import ProfileAvatar from "./provile-avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"

export default function ProfileEditForm({ userProfile }: { userProfile: UserProfile }) {
  const [state, formAction, isPending] = React.useActionState(updateUserProfile, {
    fullName: userProfile.full_name,
    username: userProfile.username,
    avatarPublicUrl: userProfile.publicUrl,
  });

  const form = useForm<UpdateUserProfileSchema>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      fullName: userProfile.full_name || "",
      username: userProfile.username || "",
    },
    mode: "onChange",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
    }
  };

  async function onSubmit(data: UpdateUserProfileSchema) {
    const hasChanges =
      data.username !== state.username || data.fullName !== state.fullName || data.avatar !== undefined;

    if (!hasChanges) {
      form.setError("noEdits", {
        type: "manual",
        message: "No changes made.",
      });
      return;
    }

    React.startTransition(() => formAction(data));

    if (state?.status === ErrorStatus.FORM_ERROR && state.formErrors) {
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        onChange={() => form.clearErrors("noEdits")}
      >
        <div className="flex flex-col items-center gap-4">
          <Label  htmlFor="avatarUpload" className="flex cursor-pointer items-center justify-center">
            <ProfileAvatar userProfile={userProfile} alt="User's avatar" size={150} />
          </Label >

          <Input
            id="avatarUpload"
            type="file"
            className="hidden"
            onChange={handleAvatarChange}
            disabled={isPending}
          />
          <p className={cn("text-sm text-gray-500", form.getValues("avatar")?.name && "text-accent-foreground")}>
            {form.getValues("avatar")?.name || "Click the avatar to change."}
          </p>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name:</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={isPending} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username:</FormLabel>
              <FormControl>
                <Input placeholder="Your preferred username" {...field} disabled={isPending} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Profile"}
        </Button>

        <>
          {[
            { condition: state?.noEdits, message: state.noEdits },
            { condition: form.formState.errors.noEdits?.message, message: form.formState.errors.noEdits?.message },
            {
              condition: state.serverError?.message,
              message: state.serverError?.message || "Invalid full name or username.",
            },
            { condition: state.bucketError?.message, message: state.bucketError?.message },
          ].map(
            (error) =>
              error.condition && (
                <Alert key={error.message} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              ),
          )}
        </>
      </form>
    </Form>
  );
}
