"use client";

import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Car, Clock, Home, PieChart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Habits", path: "/dashboard", icon: <Home /> },
  { label: "Daily", path: "/dashboard/daily", icon: <Clock /> },
  { label: "Weekly", path: "/dashboard/weekly", icon: <PieChart /> },
  { label: "Monthly", path: "/dashboard/monthly", icon: <Calendar /> },
  { label: "create", path: "/dashboard/create", icon: <Car /> },
];

export default function NavigationSelect() {
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);

  const currentSelection = navItems.find((item) => {
    const lastPart = pathname.split("/dashboard").at(-1);
    const itemLastPart = item.path.split("/dashboard").at(-1);

    return lastPart === itemLastPart;
  }) || {
    label: "Dashboard",
    icon: null,
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label={currentSelection.label}>
          {currentSelection.icon && <span aria-hidden="true">{currentSelection.icon}</span>}
          <span>{currentSelection.label}</span>
        </Button>
      </DropdownMenuTrigger>

      {open && (
        <DropdownMenuContent>
          <DropdownMenuLabel>Select your habit type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {navItems.map(
              (item) =>
                item.path && (
                  <Link key={item.path} onClick={() => setOpen(false)} href={item.path}>
                    <DropdownMenuItem>
                      {item.icon}
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  </Link>
                ),
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
