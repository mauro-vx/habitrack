import * as React from "react";

import { Control } from "react-hook-form";

import { CreateHabitSchema } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function TargetCount({
  control,
  disabled,
}: {
  control: Control<CreateHabitSchema>;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name="target_count"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Target Count:</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="number"
              min="1"
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
