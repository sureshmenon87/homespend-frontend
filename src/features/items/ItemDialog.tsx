import { useEffect, useState } from "react";
import type { Item } from "./types";
import type { Category } from "../categories/types";

interface Props {
  open: boolean;
  item?: Item | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: { name: string; categoryId: number }) => Promise<void>;
}

export default function ItemDialog({
  open,
  item,
  categories,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number>();

  useEffect(() => {
    setName(item?.name ?? "");
    setCategoryId(item?.categoryId);
  }, [item]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-96">
        <h2 className="font-semibold mb-3">
          {item ? "Edit Item" : "Add Item"}
        </h2>

        <input
          className="border w-full p-2 mb-2"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="ITEM NAME"
        />

        <select
          className="border w-full p-2 mb-3"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-black text-white px-3 py-1"
            disabled={!name || !categoryId}
            onClick={async () => {
              await onSave({ name, categoryId });
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
