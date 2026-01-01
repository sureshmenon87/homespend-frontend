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
import { toast } from "sonner";

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
  const emptyForm = {
    itemId: "",
    shopId: defaults.shopId,
    purchaseDate: defaults.purchaseDate,

    quantity: "",
    unitPrice: "",
    mrp: "",
  };

  const [form, setForm] = useState(emptyForm);

  const initialForm = {
    itemId: editingPurchase?.items?.id ?? "",
    shopId: editingPurchase?.shops?.id ?? defaults.shopId ?? "",
    purchaseDate:
      editingPurchase?.purchaseDate?.slice(0, 10) ??
      defaults.purchaseDate ??
      new Date().toISOString().slice(0, 10),
    quantity: editingPurchase?.quantity ?? "",
    unitPrice: editingPurchase?.unitPrice ?? "",
    mrp: editingPurchase?.mrp ?? "",
  };

  useEffect(() => {
    if (!editingPurchase) {
      setForm(emptyForm);
      return;
    }

    setForm({
      itemId: editingPurchase.items?.id ?? "",
      shopId: editingPurchase.shops?.id ?? "",
      purchaseDate: editingPurchase.purchaseDate
        ? editingPurchase.purchaseDate.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      quantity: editingPurchase.quantity ?? "",
      unitPrice: editingPurchase.unitPrice ?? "",
      mrp: editingPurchase?.mrp ?? "",
    });
  }, [editingPurchase]);

  const handleCancel = () => {
    setForm(emptyForm);
    onOpenChange(false);
  };

  async function handleSubmit(data: PurchaseFormData) {
    try {
      const payload = {
        itemId: form.itemId,
        shopId: form.shopId,
        purchaseDate: new Date(form.purchaseDate).toISOString(),
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
        mrp: data.mrp,
      };
      if (isEdit && editingPurchase) {
        await updatePurchase(editingPurchase.id, data);
        toast("Purchase Updated");
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
          <DialogTitle>
            {" "}
            {isEdit ? "Update Purchase" : "Add Purchase"}
          </DialogTitle>
        </DialogHeader>

        <PurchaseForm
          form={form}
          setForm={setForm}
          editingPurchase={editingPurchase}
          onSubmit={handleSubmit}
          submitting={isAdding}
          onClick={handleCancel}
          isEdit={!!editingPurchase}
        />
      </DialogContent>
    </Dialog>
  );
}
