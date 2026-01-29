import { useState, useEffect } from "react";
import type { Category } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (name: string, description: string) => Promise<void>;
}

export default function CategoryDialog({
  open,
  onClose,
  category,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(category?.name ?? "");
    setName(category?.description ?? "");
  }, [category]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-card p-4 rounded w-80">
        <h2 className="font-semibold mb-3">
          {category ? "Edit Category" : "Add Category"}
        </h2>
        {/*Category Name */}
        <input
          className="border w-full p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="CATEGORY NAME"
        />

        {/* Description */}
        <textarea
          className="border w-full p-2 mb-3 resize-none"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category description (optional)"
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-accent text-white px-3 py-1 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-accent text-white px-3 py-1 rounded bg-black text-white px-3 py-1"
            disabled={!name.trim()}
            onClick={async () => {
              await onSave(name.trim(), description);
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
