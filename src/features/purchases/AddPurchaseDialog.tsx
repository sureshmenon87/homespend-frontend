import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PurchaseForm } from "./PurchaseForm";
import type { Purchase, PurchaseFormData } from "./types";
import { usePurchases } from "./usePurchases";
import { useToast } from "@/components/ui/use-toast";
import { usePurchaseDefaults } from "@/hooks/usePurchaseDefaults";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPurchase: Purchase | null;
}

export function AddPurchaseDialog({
  open,
  onOpenChange,
  editingPurchase,
}: Props) {
  const { addPurchase, isAdding, updatePurchase } = usePurchases();
  const [defaults, setDefaults] = usePurchaseDefaults();
  const isEdit = !!editingPurchase;
  const { showToast } = useToast();
  const [form, setForm] = useState({
    itemId: "",
    shopId: "",
    purchaseDate: "",
    quantity: "",
    unitPrice: "",
  });

  const initialForm = {
    itemId: editingPurchase?.items?.id ?? "",
    shopId: editingPurchase?.shops?.id ?? defaults.shopId ?? "",
    purchaseDate:
      editingPurchase?.purchaseDate?.slice(0, 10) ??
      defaults.purchaseDate ??
      new Date().toISOString().slice(0, 10),
    quantity: editingPurchase?.quantity ?? "",
    unitPrice: editingPurchase?.unitPrice ?? "",
  };

  useEffect(() => {
    if (!editingPurchase) return;

    setForm({
      itemId: editingPurchase.items?.id ?? "",
      shopId: editingPurchase.shops?.id ?? "",
      purchaseDate: editingPurchase.purchaseDate.slice(0, 10),
      quantity: editingPurchase.quantity,
      unitPrice: editingPurchase.unitPrice,
    });
  }, [editingPurchase]);

  const handleCancel = () => {
    setForm(initialForm);
    onOpenChange(false);
  };

  async function handleSubmit(data: PurchaseFormData) {
    try {
      if (isEdit) {
        await updatePurchase(editingPurchase.id, data);
      } else {
        await addPurchase({
          itemId: data.itemId,
          shopId: data.shopId,
          purchaseDate: data.purchaseDate,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          mrp: data.mrp,
        });

        showToast("Purchase added successfully");
        setDefaults({
          shopId: data.shopId,
          purchaseDate: data.purchaseDate,
        });
      }
      onOpenChange(false);
    } catch {
      showToast("Failed to add purchase");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-gray-900 max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Purchase</DialogTitle>
        </DialogHeader>

        <PurchaseForm
          onSubmit={handleSubmit}
          submitting={isAdding}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
