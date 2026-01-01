import { useShops } from "./useShops";
import type { Shop } from "./useShops";
import { Input } from "@/components/ui/input";

interface Props {
  value?: Shop;
  onSelect: (shop: Shop) => void;
}

export function ShopAutocomplete({ value, onSelect }: Props) {
  const { shops } = useShops();

  return (
    <select
      className="w-full border rounded-md h-9 px-2"
      value={value?.id ?? ""}
      onChange={(e) => {
        const shop = shops.find((s) => s.id === Number(e.target.value));
        if (shop) onSelect(shop);
      }}
    >
      <option value="">Select shop</option>
      {shops.map((shop) => (
        <option key={shop.id} value={shop.id}>
          {shop.name}
        </option>
      ))}
    </select>
  );
}
