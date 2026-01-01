import { Button } from "@/components/ui/button";
import type { Purchase } from "./types";

interface Props {
  data: Purchase[];
  loading: boolean;
  error: string | null;
  onEdit: (p: Purchase) => void;
  onDelete: (id: number) => void;
}

export function PurchasesTable({
  data = [],
  onEdit,
  onDelete,
  loading,
  error,
}: Props) {
  if (!Array.isArray(data)) {
    console.error("PurchasesTable expects array, got:", data);
    return null;
  }
  if (loading)
    return <p className="text-sm text-muted-foreground">Loading purchases…</p>;

  if (error) return <p className="text-sm text-red-500">{error}</p>;

  if (data.length === 0)
    return <p className="text-sm text-muted-foreground">No purchases found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm rounded-lg border">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="px-3 py-2 text-left font-medium">Item</th>
            <th className="px-3 py-2 text-left font-medium">Category</th>
            <th className="px-3 py-2 text-left font-medium">Shop</th>
            <th className="px-3 py-2 text-left font-medium">Date</th>
            <th className="px-3 py-2 text-right font-medium">Qty</th>
            <th className="px-3 py-2 text-right font-medium">MRP</th>
            <th className="px-3 py-2 text-right font-medium">Unit Price</th>
            <th className="px-3 py-2 text-right font-medium">Total</th>
            <th className="px-3 py-2 text-right font-medium">Saved</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr
              key={p.id}
              className="border-b last:border-0 hover:bg-muted/50 transition group"
            >
              <td className="px-3 py-2 font-medium">{p.items.name}</td>
              <td className="px-3 py-2 text-muted-foreground">
                {p.items.category?.name ?? "—"}
              </td>
              <td className="px-3 py-2">{p.shops.name}</td>
              <td className="px-3 py-2">
                {new Date(p.purchaseDate).toLocaleDateString()}
              </td>
              <td className="px-3 py-2 text-right">{p.quantity}</td>
              <td className="px-3 py-2 text-right">{p.mrp}</td>
              <td className="px-3 py-2 text-right">{p.unitPrice}</td>

              <td className="px-3 py-2 text-right font-medium">₹{p.total}</td>
              <td className="px-3 py-2 text-right text-green-600 font-medium">
                ₹{p.saved}
              </td>
              {/* Actions */}
              <td className="px-4 py-2 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => onEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => onDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
