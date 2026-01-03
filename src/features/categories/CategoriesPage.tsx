import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categories.api";
import CategoryDialog from "./CategoryDialog";
import type { Category } from "./types";
import { toast } from "sonner";

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  const { data = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  async function handleSave(name: string) {
    if (selected) {
      await updateCategory(selected.id, name);
    } else {
      await createCategory(name);
    }
    qc.invalidateQueries({ queryKey: ["categories"] });
  }

  async function handleDelete(id: number) {
    try {
      await deleteCategory(id);
      qc.invalidateQueries({ queryKey: ["categories"] });
    } catch {
      toast.error("Category is in use and cannot be deleted");
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-3">
        <h1 className="text-xl font-semibold">Categories</h1>
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

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(c);
                    setOpen(true);
                  }}
                >
                  ✏️
                </button>
                <button onClick={() => handleDelete(c.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CategoryDialog
        open={open}
        category={selected}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
