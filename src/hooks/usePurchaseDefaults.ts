import type { Shop } from "@/features/shops/useShops";
import { useLocalStorage } from "./useLocalStorage";

export interface PurchaseDefaults {
  usePrevious: boolean;
  shop: Shop | null;
  purchaseDate: string | null;
}

export function usePurchaseDefaults() {
  const [defaults, setDefaults] = useLocalStorage<PurchaseDefaults>(
    "purchaseDefaults",
    {
      usePrevious: false,
      shop: null,
      purchaseDate: null,
    }
  );

  return { defaults, setDefaults };
}
