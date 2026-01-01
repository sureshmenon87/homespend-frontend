import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ItemAutocomplete } from "./ItemAutocomplete";
import type { Item } from "./useItems";
import type { PurchaseFormData } from "./types";
import type { Shop } from "../shops/useShops";
import { ShopAutocomplete } from "../shops/ShopAutocomplete";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema } from "./schema";
import { usePurchaseDefaults } from "@/hooks/usePurchaseDefaults";

interface Props {
  onSubmit: (data: PurchaseFormData) => void;
}

export function PurchaseForm({ onSubmit, onCancel }: Props) {
  const [item, setItem] = useState<Item | null>(null);

  const [shop, setShop] = useState<Shop | null>(null);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [defaults, setDefaults] = usePurchaseDefaults("purchaseDefaults", {
    shopId: null,
    purchaseDate: new Date(),
  });

  const form = useForm({
    resolver: zodResolver(purchaseSchema),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ---------- VALIDATION ----------
    if (!item) {
      setError("Please select an item");
      return;
    }

    if (!shop) {
      setError("Please select a shop");
      return;
    }

    if (!purchaseDate) {
      setError("Please select purchase date");
      return;
    }

    if (Number(quantity) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (Number(unitPrice) <= 0) {
      setError("Unit price must be greater than 0");
      return;
    }

    setError(null);

    // ---------- SUBMIT ----------
    onSubmit({
      itemId: item.id,
      shopId: shop.id,

      purchaseDate: new Date(purchaseDate).toISOString(),
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 z-50 w-full">
      <div className="grid grid-cols-2 gap-4">
        {/* Item */}
        <div className="col-span-2 relative">
          <ItemAutocomplete value={item ?? undefined} onSelect={setItem} />
        </div>

        {/* Category (auto-filled) */}

        <Input
          value={item?.category.name ?? ""}
          placeholder="Category"
          disabled
        />

        {/* Shop (TEMP – will become autocomplete next) */}
        <div className="col-span-2">
          <ShopAutocomplete value={shop} onSelect={setShop} />
        </div>

        {/* Date */}
        <Input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
        />

        {/* Quantity */}
        <Input
          type="number"
          step="0.01"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {/* Unit price */}
        <Input
          type="number"
          step="0.01"
          placeholder="Unit price"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Save Purchase</Button>
      </div>
    </form>
  );
}
