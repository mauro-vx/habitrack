import * as React from "react";

import { Control } from "react-hook-form";

import { CreateHabitSchema } from "../../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function NameField({ control, disabled }: { control: Control<CreateHabitSchema>; disabled?: boolean }) {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Name your habit" disabled={disabled} type="text" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
