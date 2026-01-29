import { useEffect, useState } from "react";
import type { Shop } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  shop?: Shop | null;
  onSave: (name: string) => Promise<void>;
}

export default function ShopDialog({ open, onClose, shop, onSave }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(shop?.name ?? "");
  }, [shop]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-card p-4 rounded w-96">
        <h2 className="font-semibold mb-3">
          {shop ? "Edit Shop" : "Add Shop"}
        </h2>

        <input
          className="border border-app w-full p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="SHOP NAME"
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
