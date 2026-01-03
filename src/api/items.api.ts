import { http } from "./http";
import type { Item } from "../features/items/types";

export const getItems = () => http<Item[]>("/items");

export const createItem = (data: { name: string; categoryId: number }) =>
  http<Item>("/items", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateItem = (
  id: number,
  data: { name: string; categoryId: number }
) =>
  http<Item>(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteItem = (id: number) =>
  http<void>(`/items/${id}`, {
    method: "DELETE",
  });
