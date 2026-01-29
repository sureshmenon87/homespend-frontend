import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ItemAutocomplete } from "./ItemAutocomplete";
import { ShopAutocomplete } from "./ShopAutocomplete";
import type { Purchase, PurchaseFormData, Item, Shop } from "./types";
import { usePurchaseDefaults } from "@/hooks/usePurchaseDefaults";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  editingPurchase: Purchase | null;
  onSubmit: (data: PurchaseFormData) => void;
  onCancel: () => void;
}

export function PurchaseForm({ editingPurchase, onSubmit, onCancel }: Props) {
  const isEdit = !!editingPurchase;

  // ---------- FORM STATE ----------
  const [item, setItem] = useState<Item | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [error, setError] = useState<string | null>(null);

  /* ---------------- DEFAULTS ---------------- */
  const { defaults, setDefaults } = usePurchaseDefaults();
  const usePrevious = defaults.usePrevious ?? false;

  // ---------- PREFILL FOR EDIT ----------
  useEffect(() => {
    if (!editingPurchase) {
      // ADD MODE → reset
      setItem(null);

      setPurchaseDate(new Date().toISOString().slice(0, 10));
      setQuantity("");
      setUnitPrice("");
      setMrp("");
      setError(null); // ADD MODE → use defaults ONLY if toggle ON
      if (defaults.usePrevious) {
        setShop(defaults.shop ?? null);
        setPurchaseDate(
          defaults.purchaseDate?.slice(0, 10) ??
            new Date().toISOString().slice(0, 10)
        );
      } else {
        setShop(null);
        setPurchaseDate(new Date().toISOString().slice(0, 10));
      }

      return;
    }

    // EDIT MODE
    setItem(editingPurchase.items); // 👈 FULL ITEM OBJECT
    setShop(editingPurchase.shops); // 👈 FULL SHOP OBJECT
    setPurchaseDate(editingPurchase.purchaseDate.slice(0, 10));
    setQuantity(String(editingPurchase.quantity));
    setUnitPrice(String(editingPurchase.unitPrice));
    setMrp(String(editingPurchase.mrp));
    setError(null);
  }, [editingPurchase, defaults]);

  // ---------- SUBMIT ----------
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!item) {
      setError("Please select an item");
      return;
    }
    if (!shop) {
      setError("Please select a shop");
      return;
    }

    onSubmit({
      itemId: item.id,
      shopId: shop.id,
      purchaseDate: new Date(purchaseDate).toISOString(),
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      mrp: Number(mrp), // fallback handled here
    });
    // Save defaults ONLY in ADD mode
    if (!isEdit && defaults.usePrevious) {
      setDefaults({
        usePrevious: defaults.usePrevious,
        shop,
        purchaseDate,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* USE PREVIOUS VALUES */}
      {!isEdit && (
        <div className="rounded-md border p-3 space-y-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id="usePrevious"
              checked={usePrevious}
              onCheckedChange={(v) =>
                setDefaults((d) => ({ ...d, usePrevious: Boolean(v) }))
              }
            />
            <label htmlFor="usePrevious" className="text-sm font-medium">
              Use previous values
            </label>
          </div>

          {usePrevious && defaults.shop && defaults.purchaseDate && (
            <p className="text-xs text-muted-foreground ml-6">
              {defaults.shop.name} · {defaults.purchaseDate}
            </p>
          )}
        </div>
      )}
      {/* ITEM */}
      <div>
        <label className="text-xs font-medium">Item</label>
        <ItemAutocomplete value={item} onSelect={setItem} />
      </div>

      {/* CATEGORY (AUTO) */}
      <div>
        <label className="text-xs font-medium">Category</label>
        <Input
          value={item?.category?.name ?? ""}
          disabled
          placeholder="Category"
        />
      </div>

      {/* SHOP */}
      <div>
        <label className="text-xs font-medium">Shop</label>
        <ShopAutocomplete value={shop} onSelect={setShop} />
      </div>

      {/* DATE + QTY */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Date</label>
          <Input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium">Quantity</label>
          <Input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      </div>

      {/* UNIT PRICE */}
      <div>
        <label className="text-xs font-medium">Unit price</label>
        <Input
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
        />
      </div>
      {/* MRP PRICE */}
      <div>
        <label className="text-xs font-medium">MRP</label>
        <Input value={mrp} onChange={(e) => setMrp(e.target.value)} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button
          className="bg-accent text-white px-3 py-1 rounded"
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className="bg-accent text-white px-3 py-1 rounded"
          type="submit"
        >
          {isEdit ? "Update Purchase" : "Save Purchase"}
        </Button>
      </div>
    </form>
  );
}
