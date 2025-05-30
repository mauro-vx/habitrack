import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CategoryKey } from "../habits-overview";

export function HabitSelector({
  selectedCategory,
  onCategoryChange,
  categories,
}: {
  selectedCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
  categories: CategoryKey[];
}) {
  return (
    <div className="flex gap-2 lg:gap-4">
      {categories.map((category) => (
        <Button
          variant="outline"
          size="sm"
          disabled={selectedCategory === category}
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn("hover:text-brand-light text-xs lg:text-base", selectedCategory === category && "text-brand")}
          style={{ opacity: "100" }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      ))}
    </div>
  );
}
