import { http } from "@/api/http";
import type {
  MonthlySpend,
  CategorySpend,
  ShopSavings,
  ItemPricePoint,
} from "../features/reports/types";

export const getMonthlySpend = () =>
  http<MonthlySpend[]>("/reports/monthly-spend");

export const getCategoryWiseSpend = () =>
  http<CategorySpend[]>("/reports/category-totals");

export const getShopWiseSavings = () =>
  http<ShopSavings[]>("/reports/shop-savings");
export const getItemPriceTrend = (itemId: number) =>
  http<ItemPricePoint[]>(`/reports/items/${itemId}/price-trend`);
