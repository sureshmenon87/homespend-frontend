import { useState, useEffect } from "react";
import type { Category } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (name: string) => Promise<void>;
}

export default function CategoryDialog({
  open,
  onClose,
  category,
  onSave,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(category?.name ?? "");
  }, [category]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80">
        <h2 className="font-semibold mb-3">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <input
          className="border w-full p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="CATEGORY NAME"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-black text-white px-3 py-1"
            disabled={!name.trim()}
            onClick={async () => {
              await onSave(name.trim());
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
