import { Button } from "@/components/ui/button";

export function PurchasesHeader({ onAdd }) {
  return (
    <div className="flex justify-between">
      <div>
        <h1>Purchases</h1>
        <p>Track and manage expenses</p>
      </div>

      <Button onClick={onAdd}>Add Purchase</Button>
    </div>
  );
}
