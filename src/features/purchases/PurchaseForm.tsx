import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ItemAutocomplete } from "./ItemAutocomplete";
import { ShopAutocomplete } from "./ShopAutocomplete";
import type { Purchase, PurchaseFormData, Item, Shop } from "./types";

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

  // ---------- PREFILL FOR EDIT ----------
  useEffect(() => {
    if (!editingPurchase) {
      // ADD MODE → reset
      setItem(null);
      setShop(null);
      setPurchaseDate(new Date().toISOString().slice(0, 10));
      setQuantity("");
      setUnitPrice("");
      setMrp("");
      setError(null);
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
  }, [editingPurchase]);

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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? "Update Purchase" : "Save Purchase"}
        </Button>
      </div>
    </form>
  );
}
