import { useEffect, useState } from "react";
import type { Item, Category } from "../features/purchases/types";

interface Props {
  value: Item | null;
  category: Category | null;
  onSelect: (item: Item | null) => void;
  onCategorySelect: (category: Category | null) => void;

  onCreateItem: (payload: {
    name: string;
    categoryId: number;
  }) => Promise<Item>;

  onCreateCategory: (name: string) => Promise<Category>;
}
const API_BASE = "http://localhost:3000";
export function ItemAutocomplete({
  value,
  category,
  onSelect,
  onCategorySelect,
  onCreateItem,
  onCreateCategory,
}: Props) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/items?search=${query}`)
      .then((r) => r.json())
      .then(setItems);

    fetch(`${API_BASE}/api/categories`)
      .then((r) => r.json())
      .then(setCategories);
  }, [query]);

  async function handleCreate() {
    if (!category) return;

    const newItem = await onCreateItem({
      name: query.toUpperCase(),
      categoryId: category.id,
    });

    onSelect(newItem);
    setShowCreate(false);
  }

  return (
    <div className="space-y-2">
      <input
        value={value?.name ?? query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect(null);
          setShowCreate(true);
        }}
        placeholder="Item"
        className="input"
      />

      {items.map((i) => (
        <div
          key={i.id}
          className="cursor-pointer"
          onClick={() => {
            onSelect(i);
            onCategorySelect(i.category);
            setShowCreate(false);
          }}
        >
          {i.name}
        </div>
      ))}

      {showCreate && (
        <div className="border p-2 rounded">
          <select
            value={category?.id ?? ""}
            onChange={(e) => {
              const cat = categories.find(
                (c) => c.id === Number(e.target.value)
              );
              onCategorySelect(cat ?? null);
            }}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            disabled={!category}
            onClick={handleCreate}
            className="btn-primary mt-2"
          >
            Create "{query.toUpperCase()}"
          </button>
        </div>
      )}
    </div>
  );
}
