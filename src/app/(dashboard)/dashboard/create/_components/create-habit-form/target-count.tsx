import { Control } from "react-hook-form";
import { Plus, Minus } from "lucide-react";

import { CreateSchemaClient } from "@/app/(dashboard)/dashboard/_utils/schema-client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function TargetCount({
  control,
  disabled,
}: {
  control: Control<CreateSchemaClient>;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name="target_count"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Target Count</FormLabel>
          <FormControl>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={disabled || field.value <= 1}
                onClick={() => {
                  const newValue = Math.max(1, Number(field.value) - 1);
                  field.onChange(newValue);
                }}
                className="h-9 w-9 rounded-r-none"
                aria-label="Decrease target count"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="border-input bg-background flex h-9 min-w-[3rem] items-center justify-center border border-x-0 px-3 text-sm">
                {field.value || 1}
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={disabled}
                onClick={() => {
                  const newValue = Number(field.value || 1) + 1;
                  field.onChange(newValue);
                }}
                className="h-9 w-9 rounded-l-none"
                aria-label="Increase target count"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
