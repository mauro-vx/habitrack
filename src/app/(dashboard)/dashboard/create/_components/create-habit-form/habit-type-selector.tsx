import { Control } from "react-hook-form";

import { HabitType } from "@/app/enums";
import { CreateSchemaClient } from "@/app/(dashboard)/dashboard/_utils/schema-client";
import { useCapitalizeFirst } from "@/hooks/use-capitalize-first";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";

export function TypeField({
  control,
  disabled,
  onChange,
}: {
  control: Control<CreateSchemaClient>;
  disabled?: boolean;
  onChange: (value: HabitType) => void;
}) {
  const capitalizeFirst = useCapitalizeFirst();

  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value: HabitType) => {
                field.onChange(value);
                onChange(value);
              }}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue>{capitalizeFirst(field.value)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={HabitType.DAILY}>{capitalizeFirst(HabitType.DAILY)}</SelectItem>
                  <SelectItem value={HabitType.WEEKLY}>{capitalizeFirst(HabitType.WEEKLY)}</SelectItem>
                  <SelectItem value={HabitType.CUSTOM}>{capitalizeFirst(HabitType.CUSTOM)}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
