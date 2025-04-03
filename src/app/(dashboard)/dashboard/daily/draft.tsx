import * as React from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Circle } from "lucide-react";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const habits = [
  {
    description: "Morning Jogging",
    status: "done",
  },
  {
    description: "Reading a Book",
    status: "pending",
  },
  {
    description: "Meditation",
    status: "ignored",
  },
  {
    description: "Healthy Breakfast",
    status: "done",
  },
  {
    description: "Daily Journaling",
    status: "pending",
  },
  {
    description: "Evening Yoga",
    status: "incomplete",
  },
  {
    description: "Organizing Workspace",
    status: "ignored",
  },
  {
    description: "Studying 1 Hour",
    status: "done",
  },
  {
    description: "Drinking Enough Water",
    status: "pending",
  },
  {
    description: "Cleaning the Room",
    status: "incomplete",
  },
  {
    description: "Learning a New Skill",
    status: "ignored",
  },
  {
    description: "Cooking a New Recipe",
    status: "done",
  },
  {
    description: "Spending Time with Family",
    status: "pending",
  },
  {
    description: "Planning Next Day",
    status: "ignored",
  },
  {
    description: "Practicing Gratitude",
    status: "done",
  },
  {
    description: "Listening to Podcasts",
    status: "pending",
  },
  {
    description: "Reducing Screen Time",
    status: "incomplete",
  },
  {
    description: "Gardening",
    status: "ignored",
  },
  {
    description: "Taking a Walk",
    status: "done",
  },
  {
    description: "Writing Code",
    status: "pending",
  },
];

export default function Draft() {
  return (
    <div className="container flex flex-1 items-center justify-center">
      <div className="{/*p-14 */} flex h-full w-full flex-col border-2 border-yellow-200">
        <ScrollArea className="{/*px-6 */}">
          <Table>
            <TableCaption>Track your daily habits and progress effectively.</TableCaption>
            <TableHeader>
              <TableRow className="text-2xl">
                <TableHead>Habit</TableHead>

                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {habits.map((habit) => (
                <TableRow key={habit.description}>
                  <TableCell className="font-medium">{habit.description}</TableCell>
                  <TableCell className="h-20">
                    <Select value={habit.status}>
                      <SelectTrigger className="flex min-h-fit min-w-fit items-center justify-center rounded-full p-1 [&>svg:last-child]:hidden">
                        <Circle
                          className={cn("min-h-8 min-w-8", {
                            "fill-gray-500": habit.status === "pending",
                            "fill-green-500": habit.status === "done",
                            "fill-blue-500": habit.status === "ignored",
                            "fill-red-500": habit.status === "incomplete",
                          })}
                        />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="pending">
                            <Circle className="fill-gray-500" /> Pending
                          </SelectItem>
                          <SelectItem value="done">
                            <Circle className="fill-green-500" /> Done
                          </SelectItem>
                          <SelectItem value="ignored">
                            <Circle className="fill-blue-500" /> Ignored
                          </SelectItem>
                          <SelectItem value="incomplete">
                            <Circle className="fill-red-500" /> Incomplete
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  {/*<TableCell>{invoice.paymentMethod}</TableCell>*/}
                  {/*<TableCell className="text-right">{invoice.totalAmount}</TableCell>*/}
                </TableRow>
              ))}
            </TableBody>
            {/*<TableFooter>*/}
            {/*  <TableRow>*/}
            {/*    <TableCell colSpan={3}>Total</TableCell>*/}
            {/*    <TableCell className="text-right">$2,500.00</TableCell>*/}
            {/*  </TableRow>*/}
            {/*</TableFooter>*/}
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
