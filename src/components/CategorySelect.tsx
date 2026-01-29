import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";

interface Category {
  id: number;
  name: string;
  description: string | null;
  icon?: string | null;
}

interface Props {
  value?: number;
  categories: Category[];
  onChange: (id: number) => void;
}

export function CategorySelect({ value, categories, onChange }: Props) {
  const selected = categories.find((c) => c.id === value);

  return (
    <Select.Root
      value={value?.toString()}
      onValueChange={(v) => onChange(Number(v))}
    >
      <Select.Trigger className="border border-app px-3 py-2 flex items-center gap-2 w-full">
        {selected ? (
          <>
            <CategoryIcon icon={selected.icon} />
            <span>{selected.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select category</span>
        )}
        <ChevronDown className="ml-auto h-4 w-4" />
      </Select.Trigger>

      <Select.Content className="bg-card border border-app rounded shadow-md w-[320px] max-h-[300px]">
        <Select.Viewport className="max-h-[300px] overflow-y-auto">
          {categories.map((c) => (
            <Select.Item
              key={c.id}
              value={c.id.toString()}
              className="px-3 py-2 cursor-pointer focus:bg-accent"
            >
              <div className="flex gap-3">
                <CategoryIcon icon={c.icon} />
                <div>
                  <div className="font-medium">{c.name}</div>
                  {c.description && (
                    <div className="text-xs text-muted-foreground">
                      {c.description}
                    </div>
                  )}
                </div>
              </div>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
}
