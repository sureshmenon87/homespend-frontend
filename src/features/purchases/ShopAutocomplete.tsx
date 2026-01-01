import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Shop {
  id: number;
  name: string;
}

interface Props {
  value: Shop | null;
  onSelect: (shop: Shop) => void;
}

export function ShopAutocomplete({ value, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/shops")
      .then((r) => r.json())
      .then(setShops);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value ? value.name : "Select shop"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search shop..." />
          <CommandList>
            {shops.map((shop) => (
              <CommandItem
                key={shop.id}
                onSelect={() => {
                  onSelect(shop);
                  setOpen(false);
                }}
              >
                {shop.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
