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
  form: PurchaseFormData;
  setForm: React.Dispatch<React.SetStateAction<PurchaseFormData>>;
  onSubmit: (data: PurchaseFormData) => void;
  onCancel: () => void;
  isEdit: boolean;
  editingPurchase: any;
}

export function PurchaseForm({
  setForm,
  onSubmit,
  onCancel,
  editingPurchase,
  isEdit,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [defaults, setDefaults] = usePurchaseDefaults("purchaseDefaults", {
    shopId: null,
    purchaseDate: new Date(),
  });
  const [usePrevious, setUsePrevious] = useState(true);

  const [item, setItem] = useState<Item | null>(editingPurchase?.items ?? null);

  const [shop, setShop] = useState<Shop | null>(editingPurchase?.shops ?? null);

  const [purchaseDate, setPurchaseDate] = useState(
    editingPurchase?.purchaseDate?.slice(0, 10) ?? ""
  );

  const [quantity, setQuantity] = useState(
    editingPurchase?.quantity?.toString() ?? ""
  );

  const [unitPrice, setUnitPrice] = useState(
    editingPurchase?.unitPrice?.toString() ?? ""
  );

  const [mrp, setMrp] = useState(editingPurchase?.mrp?.toString() ?? "");

  const initialDate = usePrevious
    ? defaults.purchaseDate
    : new Date().toISOString().slice(0, 10);

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
      mrp: Number(mrp),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 z-50 w-full">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={usePrevious}
          onChange={(e) => setUsePrevious(e.target.checked)}
        />
        Use previous values
      </label>
      <div className="grid grid-cols-2 gap-4">
        {/* Item */}
        <div className="col-span-2 relative">
          <ItemAutocomplete value={item} onSelect={setItem} />
        </div>

        {/* Category (auto-filled) */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Category
          </label>

          <Input
            value={item?.category.name ?? ""}
            placeholder="Category"
            disabled
          />
        </div>

        {/* Shop (TEMP – will become autocomplete next) */}
        <div className="col-span-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Shop
            </label>
            <ShopAutocomplete value={shop} onSelect={setShop} />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Purchase Date
          </label>
          <Input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>

        {/* Quantity */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Quantity
          </label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
          />
        </div>

        {/* Unit price */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Unit Price
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="Unit price"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </div>

        {/* MRP price */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            MRP Price
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="MRP price"
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
          />
        </div>
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
        <Button type="submit" disabled={!item || !shop}>
          {isEdit ? "Update Purchase" : "Save Purchase"}
        </Button>
      </div>
    </form>
  );
}
