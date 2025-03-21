"use client";

import * as React from "react";

import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserProfile } from "./types";
import { type UpdateUserProfileSchema, updateUserProfileSchema } from "@/lib/actions/schemas/profile";
import { updateUserProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import ProfileAvatar from "./provile-avatar";

export default function ProfileForm({ userProfile }: { userProfile: UserProfile }) {
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      onChange={() => form.clearErrors("noEdits")}
    >
      <div className="flex flex-col items-center gap-4">
        <label htmlFor="avatarUpload" className="flex cursor-pointer items-center justify-center">
          <ProfileAvatar userProfile={userProfile} alt="User's avatar" size={150} />
        </label>

        <input
          id="avatarUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={isPending}
        />
        <p className="text-sm text-gray-500">{form.getValues("avatar")?.name || "Click the avatar to change."}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium">
          Full name:
        </label>
        <input
          id="fullName"
          {...form.register("fullName")}
          type="text"
          placeholder="John Doe"
          className="block w-full rounded-md border px-3 py-2 shadow-sm"
          disabled={isPending}
        />
        <p className="mt-1 text-sm text-red-500">{form.formState.errors.fullName?.message}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium">
          Username:
        </label>
        <input
          id="username"
          {...form.register("username")}
          type="text"
          placeholder="Your preferred username"
          className="block w-full rounded-md border px-3 py-2 shadow-sm"
          disabled={isPending}
        />
        <p className="mt-1 text-sm text-red-500">{form.formState.errors.username?.message}</p>
      </div>

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
  );
}
