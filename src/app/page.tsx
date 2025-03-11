import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen flex-col gap-8 py-16 container">
      <header className="row-start-1 flex flex-col items-center gap-6 text-center">
        <Image src="/icons/logo.svg" alt="HabiTrack logo" width={120} height={120} priority />
        <h1 className="text-primary mt-4 text-3xl font-medium sm:text-5xl">Welcome to HabiTrack</h1>
        <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
          The ultimate tool to end procrastination and take charge of your habits. Stay organized, track your progress,
          and create the life you’ve always wanted.
        </p>
      </header>

      <main className="flex flex-1 flex-col items-center gap-12 sm:items-start">
        <div className="flex w-full flex-col items-center rounded-lg bg-lime-500 py-12 text-center">
          <Image src="/images/logo-gradient.webp" alt="HabiTrack slogan" width={800} height={450} priority />
          <h1 className="mt-8 text-6xl font-extrabold tracking-[12px] text-green-700 font-poppins">HABITRACK</h1>
          <p className="mt-2 text-lg tracking-[8px] text-green-700">SMALL STEPS, BIG CHANGES.</p>
        </div>
      </main>

      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">Footer</footer>
    </div>
  );
}
