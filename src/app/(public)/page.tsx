import Image from "next/image";

import { WelcomeBanner } from "@/app/(public)/_components/welcome-banner";

export default function Page() {
  return (
    <main className="container flex flex-col items-center gap-8 py-4 lg:py-12">
      <WelcomeBanner
        title="Welcome to HabiTrack"
        description="The ultimate tool to end procrastination and take charge of your habits. Stay organized, track your progress,
          and create the life you’ve always wanted."
        className="lg:px-40"
      />

      <section className="flex w-full flex-col items-center rounded-lg bg-lime-500 py-4 text-center lg:py-12">
        <Image src="/images/logo-gradient.webp" alt="HabiTrack slogan" width={800} height={450} priority />
        <h1 className="font-poppins mt-8 text-2xl font-extrabold tracking-[12px] text-green-700 lg:text-6xl">
          HABITRACK
        </h1>
        <p className="mt-2 text-xs tracking-[8px] text-green-700 lg:text-lg">SMALL STEPS, BIG CHANGES</p>
      </section>

      <WelcomeBanner
        title="Break Free, Build Better Habits"
        description="Escape the cycle of procrastination and start creating lasting habits. With HabiTrack, every step forward
          counts."
        className="lg:px-40"
      />

      <WelcomeBanner
        title="Small Changes, Big Transformations"
        description="Every great success starts with a habit. Track your growth daily and turn your ambitions into reality."
        className="lg:px-40"
      />

      <WelcomeBanner
        title="Your Habits, Your Superpower"
        description="Take control of your day and unlock the power of consistency. Start thriving, one habit at a time."
        className="lg:px-40"
      />

      <WelcomeBanner
        title="Design the Life You Desire"
        description="Stay focused, stay organized, and turn your goals into habits. HabiTrack helps you build a life you’ll love."
        className="lg:px-40"
      />
    </main>
  );
}
