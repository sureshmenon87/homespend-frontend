import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PurchaseForm } from "./PurchaseForm";
import { usePurchases } from "./usePurchases";
import type { Purchase, PurchaseFormData } from "./types";

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
  const { addPurchase, updatePurchase } = usePurchases();
  const isEdit = !!editingPurchase;

  async function handleSubmit(data: PurchaseFormData) {
    if (isEdit && editingPurchase) {
      await updatePurchase(editingPurchase.id, data);
    } else {
      await addPurchase(data);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-gray-900 max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Purchase" : "Add Purchase"}
          </DialogTitle>
        </DialogHeader>

        <PurchaseForm
          editingPurchase={editingPurchase}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
