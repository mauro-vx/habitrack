import { Control } from "react-hook-form";

import { CreateSchemaClient } from "@/app/(dashboard)/dashboard/_utils/schema-client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function DescriptionField({
  control,
  disabled,
}: {
  control: Control<CreateSchemaClient>;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Description (optional)" disabled={disabled} type="text" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
