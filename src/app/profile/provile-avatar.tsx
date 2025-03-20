import * as React from "react";

import Image from "next/image";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { UserProfile } from "@/app/profile/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AvatarFrame = ({
  size,
  children,
  className,
  ...props
}: {
  size: number;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Avatar style={{ height: size, width: size }} {...props} className={className}>
      {children}
    </Avatar>
  );
};

export default function ProfileAvatar({
  userProfile,
  alt,
  size = 40,
  className,
}: {
  userProfile: UserProfile;
  alt: string;
  size?: number;
  className?: string;
}) {
  if (userProfile.avatar_url === null) {
    return (
      <AvatarFrame size={size} className={className}>
        <AvatarFallback>
          <div
            className="h-full w-full rounded-full bg-conic-180 from-[var(--color-foreground)] via-[var(--color-brand)] to-[var(--color-background)]"
            aria-label="Fallback avatar"
            role="img"
          />
        </AvatarFallback>
      </AvatarFrame>
    );
  }

  if (!userProfile || !userProfile.publicUrl) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to get the public URL for the avatar.</AlertDescription>
      </Alert>
    );
  }

  return (
    <AvatarFrame size={size} className={cn("flex outline-primary rounded-full outline-4", className)}>
      <Image
        src={userProfile.publicUrl}
        alt={alt}
        width={size}
        height={size}
        className="m-auto size-[90%]"
      />
    </AvatarFrame>
  );
}
