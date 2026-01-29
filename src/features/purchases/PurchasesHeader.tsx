import { Button } from "@/components/ui/button";

export function PurchasesHeader({ onAdd }) {
  return (
    <div className="flex justify-between">
      <div>
        <h1>Purchases</h1>
        <p>Track and manage expenses</p>
      </div>

      <Button
        className="bg-accent text-white px-3 py-1 rounded"
        onClick={onAdd}
      >
        Add Purchase
      </Button>
    </div>
  );
}
