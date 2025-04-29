"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useBreakpoint } from "@/hooks/use-breakpoint-hook";

const habitSections: { title: string; href: string; description: string }[] = [
  {
    title: "Daily Habits",
    href: "/docs/habits/daily",
    description: "Learn how to create and maintain daily habits for consistent progress toward your goals.",
  },
  {
    title: "Weekly Habits",
    href: "/docs/habits/weekly",
    description: "Understand how to set up habits that occur on specific days of the week or with weekly frequency.",
  },
  {
    title: "Custom Habits",
    href: "/docs/habits/custom",
    description: "Create personalized habit tracking with custom frequencies, reminders, and completion criteria.",
  },
  {
    title: "Week Summary",
    href: "/docs/summaries/week",
    description: "View and interpret weekly progress reports for individual habits to monitor long-term trends.",
  },
  {
    title: "Day Summary",
    href: "/docs/summaries/day",
    description: "Get a complete overview of all habits scheduled for today with completion status and insights.",
  },
];

export default function DocumentationNavMenu() {
  const isLgScreen = useBreakpoint("lg");

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-xs lg:text-base">
            {isLgScreen ? "Documentation" : "Docs"}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-1 lg:gap-3 p-3 lg:p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-3 lg:p-6 no-underline outline-none select-none focus:shadow-md"
                    href="/docs"
                  >
                    <div className="mt-2 lg:mt-4 mb-1 lg:mb-2 text-base lg:text-lg font-medium">Habit Tracker</div>
                    <p className="text-muted-foreground text-xs lg:text-sm leading-tight">
                      A comprehensive guide to tracking and maintaining your habits effectively. Learn how to build
                      consistency with daily and weekly habits, customize your tracking, and analyze your progress over
                      time.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="/docs/getting-started"
                title="Getting Started"
              >
                Quick overview of how to set up your first habit and start tracking.
              </ListItem>
              <ListItem
                href="/docs/features"
                title="Features"
              >
                Explore all the features available to help you maintain your habits.
              </ListItem>
              <ListItem
                href="/docs/faq"
                title="FAQ"
              >
                Common questions and answers about habit tracking best practices.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-xs lg:text-base">
            {isLgScreen ? "Habit Types" : "Habits"}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-full gap-1 lg:gap-3 p-2 lg:p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {habitSections.map((section) => (
                <ListItem
                  key={section.title}
                  title={section.title}
                  href={section.href}
                >
                  {section.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a"> & { title: string }>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-2 lg:p-3 leading-none no-underline transition-colors outline-none select-none",
              className,
            )}
            {...props}
          >
            <div className="text-xs lg:text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-xs lg:text-sm leading-snug">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
