import { useEffect, useState } from "react";

export interface Item {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/items");
      const data = await res.json();
      setItems(data);
      setLoading(false);
    }
    load();
  }, []);

  return { items, loading };
}
