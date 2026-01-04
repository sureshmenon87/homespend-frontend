// src/components/CategorySelect.tsx
import { useEffect, useState } from "react";
import type { Category } from "../features/purchases/types";

interface Category {
  id: number;
  name: string;
  description: string | null;
  icon?: string | null;
}

interface Props {
  value: Category | null;
  categories: Category[];
  onChange: (c: Category) => void;
}
const API_BASE = "http://localhost:3000";

export function CategorySelect({ value, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  async function createCategory() {
    const res = await fetch(`${API_BASE}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.toUpperCase() }),
    });

    const created: Category = await res.json();
    setCategories((prev) => [...prev, created]);
    onChange(created);
  }

  return (
    <div>
      <select
        value={value?.id ?? ""}
        onChange={(e) => {
          const cat = categories.find((c) => c.id === Number(e.target.value));
          if (cat) onChange(cat);
        }}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        placeholder="New category"
        value={name}
        onChange={(e) => setName(e.target.value.toUpperCase())}
      />

      <button onClick={createCategory}>Add</button>
    </div>
  );
}
