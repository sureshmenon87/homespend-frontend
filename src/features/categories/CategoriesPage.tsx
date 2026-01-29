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
import { CategoryIcon } from "@/components/CategoryIcon";

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  async function handleSave(name: string, description: string) {
    if (selected) {
      await updateCategory(selected.id, name, description);
    } else {
      await createCategory(name, description);
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

      <table className="w-full border border-app">
        <thead>
          <tr className="bg-app min-h-screen">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t border-app">
              <td className="p-2 flex items-center gap-2">
                <CategoryIcon icon={c.icon} />
                <span>{c.name}</span>
              </td>
              <td className="p-2 text-sm text-app">{c.description || "—"}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(c);
                    setOpen(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="bg-accent text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(c.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-app">
                No categories found
              </td>
            </tr>
          )}
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
