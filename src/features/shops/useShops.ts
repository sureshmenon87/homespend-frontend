import { useEffect, useState } from "react";

export interface Shop {
  id: number;
  name: string;
}

export function useShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/shops")
      .then((res) => res.json())
      .then(setShops)
      .finally(() => setLoading(false));
  }, []);

  return { shops, loading };
}
