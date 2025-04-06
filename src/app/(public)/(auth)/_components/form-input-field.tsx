import { Control, FieldValues, FieldPath } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function FormInputField<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  control,
  res,
  disabled,
}: {
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: "email" | "password" | "text";
  control: Control<TFieldValues>;
  res?: string;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} disabled={disabled} />
          </FormControl>
          {res && <FormDescription>{res}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
