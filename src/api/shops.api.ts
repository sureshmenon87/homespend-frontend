import { http } from "./http";
import type { Shop } from "../features/shops/types";

export const getShops = () => http<Shop[]>("/shops");

export const createShop = (name: string, description: string) =>
  http<Shop>("/shops", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });

export const updateShop = (id: number, name: string, description: string) =>
  http<Shop>(`/shops/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, description }),
  });

export const deleteShop = (id: number) =>
  http<void>(`/shops/${id}`, {
    method: "DELETE",
  });
