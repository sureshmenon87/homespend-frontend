// src/hooks/usePurchaseDefaults.ts
import { useState, useEffect } from "react";

type Defaults = {
  shopId?: number;
  purchaseDate?: string;
};

export function usePurchaseDefaults() {
  const [defaults, setDefaults] = useState<Defaults>(() => {
    const raw = localStorage.getItem("purchaseDefaults");
    return raw ? JSON.parse(raw) : {};
  });

  useEffect(() => {
    localStorage.setItem("purchaseDefaults", JSON.stringify(defaults));
  }, [defaults]);

  return [defaults, setDefaults] as const;
}
