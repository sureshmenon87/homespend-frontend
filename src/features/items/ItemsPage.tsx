import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../api/items.api";
import { getCategories } from "../../api/categories.api";
import ItemDialog from "./ItemDialog";
import type { Item } from "./types";
import { toast } from "sonner";

type SortKey = "name" | "category";
type SortOrder = "asc" | "desc";

export default function ItemsPage() {
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const { data: items = [] } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  async function handleSave(data: { name: string; categoryId: number }) {
    if (selected) {
      await updateItem(selected.id, data);
    } else {
      await createItem(data);
    }
    qc.invalidateQueries({ queryKey: ["items"] });
  }

  async function handleDelete(id: number) {
    try {
      await deleteItem(id);
      qc.invalidateQueries({ queryKey: ["items"] });
    } catch {
      toast.error("Item is in use and cannot be deleted");
    }
  }

  // 🔍 Search + Sort Logic
  const filteredItems = useMemo(() => {
    let result = items.filter((i) =>
      `${i.name} ${i.categoryName}`.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      const aVal = sortKey === "name" ? a.name : a.categoryName;
      const bVal = sortKey === "name" ? b.name : b.categoryName;

      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    return result;
  }, [items, search, sortKey, sortOrder]);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Items</h1>
        <button
          className="bg-black text-white px-3 py-1"
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          + Add Item
        </button>
      </div>

      {/* Search + Sort Controls */}
      <div className="flex gap-3 items-center">
        <input
          className="border border-app px-3 py-2 w-64"
          placeholder="Search item or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-app px-2 py-2"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="name">Sort by Item</option>
          <option value="category">Sort by Category</option>
        </select>

        <button
          className="border border-app  px-3 py-2"
          onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
        >
          {sortOrder === "asc" ? "↑ A–Z" : "↓ Z–A"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full border border-app">
        <thead>
          <tr className="bg-app min-h-screen">
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((i) => (
            <tr key={i.id} className="border-t border-app">
              <td className="p-2">{i.name}</td>
              <td className="p-2">{i.category.name}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(i);
                    setOpen(true);
                  }}
                >
                  ✏️
                </button>
                <button onClick={() => handleDelete(i.id)}>🗑️</button>
              </td>
            </tr>
          ))}

          {filteredItems.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-app">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Dialog */}
      <ItemDialog
        open={open}
        item={selected}
        categories={categories}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
