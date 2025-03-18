import * as React from "react";

import Image from "next/image";

import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

export default async function ProfileAvatar({
  avatar_url,
  alt,
  size = 40,
  className,
}: {
  avatar_url: string | null;
  alt: string;
  size?: number;
  className?: string;
}) {
  const supabase = await createClient();

  if (avatar_url === null) {
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

  const { data: avatarData } = supabase.storage.from("avatars").getPublicUrl(avatar_url);

  if (!avatarData || !avatarData.publicUrl) {
    console.error("Failed to get the public URL for the avatar.");
    return (
      <AvatarFrame size={size} className={className}>
        <AvatarFallback>Error</AvatarFallback>
      </AvatarFrame>
    );
  }

  return (
    <AvatarFrame size={size} className={className}>
      <Image
        src={avatarData.publicUrl}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
        placeholder="blur"
        blurDataURL="/path-to-blur-image.png" // Optional image placeholder if pre-configured
      />
    </AvatarFrame>
  );
}
