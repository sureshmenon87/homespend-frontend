import { api } from "./client";
import type { PurchaseFormSchema } from "@/features/purchases/schema";

export type CreatePurchasePayload = {
  itemId: number;
  shopId: number;
  purchaseDate: string;
  quantity: number;
  unitPrice: number;
  mrp?: number;
};

export interface PurchaseResponse {
  id: number;
  itemName: string;
  category: string;
  shop: string;
  purchaseDate: string;
  quantity: number;
  unitPrice: number;
  total: number;
  saved: number;
}

export async function fetchPurchases(): Promise<PurchaseResponse[]> {
  return api<PurchaseResponse[]>("/purchases");
}

export const createPurchase = (data: CreatePurchasePayload) =>
  api("/purchases", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updatePurchase = (id: number, data: any) =>
  api(`/purchases/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deletePurchase = (id: number) =>
  api(`/purchases/${id}`, {
    method: "DELETE",
  });
