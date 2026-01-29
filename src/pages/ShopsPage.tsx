import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getShops, createShop, updateShop, deleteShop } from "@/api/shops.api";
import ShopDialog from "../features/shops/ShopDialog";
import type { Shop } from "../features/shops/types";
import { toast } from "sonner";

export default function ShopsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Shop | null>(null);

  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
  });

  async function handleSave(data: { name: string }) {
    if (selected) {
      await updateShop(selected.id, data);
    } else {
      await createShop(data);
    }
    qc.invalidateQueries({ queryKey: ["shops"] });
  }

  async function handleDelete(id: number) {
    try {
      await deleteShop(id);
      qc.invalidateQueries({ queryKey: ["shops"] });
    } catch {
      toast.error("Shop is in use and cannot be deleted");
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Shops</h1>
        <button
          className="bg-black text-white px-3 py-1"
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          + Add
        </button>
      </div>

      <table className="w-full border border-app">
        <thead>
          <tr className="bg-app min-h-screen">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((s) => (
            <tr key={s.id} className="border-t border-app">
              <td className="p-2 font-medium">{s.name}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(s);
                    setOpen(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="bg-accent text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(s.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}

          {shops.length === 0 && (
            <tr>
              <td colSpan={2} className="p-4 text-center text-app">
                No shops found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ShopDialog
        open={open}
        shop={selected}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
