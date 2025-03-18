import Image from "next/image";

import AnimatedSection from "@/components/ui/animated-section";
import Logo from "~/public/icons/logo.svg";

export default function Home() {
  return (
    <main className="container flex flex-1 flex-col gap-8 py-12">
      <AnimatedSection className="row-start-1 flex flex-col items-center gap-6 text-center">
        <Logo className="size-32 shrink-0" aria-label="HabiTrack logo" />
        <h1 className="text-primary text-3xl font-medium sm:text-5xl">Welcome to HabiTrack</h1>
        <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
          The ultimate tool to end procrastination and take charge of your habits. Stay organized, track your progress,
          and create the life you’ve always wanted.
        </p>
      </AnimatedSection>

      <section className="flex flex-1 flex-col items-center gap-12 sm:items-start">
        <div className="flex w-full flex-col items-center rounded-lg bg-lime-500 py-12 text-center">
          <Image src="/images/logo-gradient.webp" alt="HabiTrack slogan" width={800} height={450} priority />
          <h1 className="font-poppins mt-8 text-6xl font-extrabold tracking-[12px] text-green-700">HABITRACK</h1>
          <p className="mt-2 text-lg tracking-[8px] text-green-700">SMALL STEPS, BIG CHANGES.</p>
        </div>
      </section>

      <AnimatedSection className="row-start-1 flex flex-col items-center gap-6 text-center">
        <Logo className="size-32 shrink-0" aria-label="HabiTrack logo" />
        <h1 className="text-primary text-3xl font-medium sm:text-5xl">Break Free, Build Better Habits</h1>
        <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
          Escape the cycle of procrastination and start creating lasting habits. With HabiTrack, every step forward
          counts.
        </p>
      </AnimatedSection>

      <AnimatedSection className="row-start-1 flex flex-col items-center gap-6 text-center">
        <Logo className="size-32 shrink-0" aria-label="HabiTrack logo" />
        <h1 className="text-primary text-3xl font-medium sm:text-5xl">Small Changes, Big Transformations</h1>
        <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
          Every great success starts with a habit. Track your growth daily and turn your ambitions into reality.
        </p>
      </AnimatedSection>

      <AnimatedSection className="row-start-1 flex flex-col items-center gap-6 text-center">
        <Logo className="size-32 shrink-0" aria-label="HabiTrack logo" />
        <h1 className="text-primary text-3xl font-medium sm:text-5xl">Your Habits, Your Superpower</h1>
        <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
          Take control of your day and unlock the power of consistency. Start thriving, one habit at a time.
        </p>
      </AnimatedSection>

      <AnimatedSection className="row-start-1 flex flex-col items-center gap-6 text-center">
        <Logo className="size-32 shrink-0" aria-label="HabiTrack logo" />
        <h1 className="text-primary text-3xl font-medium sm:text-5xl">Welcome to HabiTrack</h1>
        <h1 className="text-primary text-3xl font-medium sm:text-5xl">Design the Life You Desire</h1>
        <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
          Stay focused, stay organized, and turn your goals into habits. HabiTrack helps you build a life you’ll love.
        </p>
      </AnimatedSection>

      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">Footer</footer>
    </main>
  );
}
