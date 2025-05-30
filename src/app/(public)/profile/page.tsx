import * as React from 'react';

import { Profile } from "./profile";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Skeleton className="h-[40px] min-w-full rounded-md" />
      <Skeleton size={154} />
      <Skeleton height={48} className="min-w-full rounded-md" />
      <Skeleton height={48} className="min-w-full rounded-md" />
      <Skeleton height={36} className="min-w-[50%] self-end rounded-md" />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="container flex h-screen items-center justify-center">
      <React.Suspense fallback={<ProfileSkeleton />}>
        <Profile />
      </React.Suspense>
    </main>
  );
}
