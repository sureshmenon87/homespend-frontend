import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PurchaseForm } from "./PurchaseForm";
import { usePurchases } from "./usePurchases";
import type { Purchase, PurchaseFormData } from "./types";
import { usePurchaseDefaults } from "@/hooks/usePurchaseDefaults";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPurchase: Purchase | null;
  onSuccess: () => void;
}

export function AddPurchaseDialog({
  open,
  onOpenChange,
  editingPurchase,
  onSuccess,
}: Props) {
  const { addPurchase, updatePurchase } = usePurchases();
  const isEdit = !!editingPurchase;

  async function handleSubmit(data: PurchaseFormData) {
    if (isEdit && editingPurchase) {
      await updatePurchase(editingPurchase.id, data);
    } else {
      await addPurchase(data);
    }
    onSuccess();
    onOpenChange(false);
  }
  function handleCancel() {
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-app max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Purchase" : "Add Purchase"}
          </DialogTitle>
        </DialogHeader>

        <PurchaseForm
          editingPurchase={editingPurchase}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isEdit={isEdit}
        />
      </DialogContent>
    </Dialog>
  );
}
