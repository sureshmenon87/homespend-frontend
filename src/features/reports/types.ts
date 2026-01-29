export interface MonthlySpend {
  month: string;
  totalSpent: number;
}

export interface CategorySpend {
  category: string;
  totalSpent: number;
}

export interface ShopSavings {
  shop: string;
  totalSaved: number;
}

export interface ItemPricePoint {
  month: string;
  unitPrice: number;
}
