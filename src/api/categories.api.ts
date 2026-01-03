import { http } from "./http";
import type { Category } from "../features/categories/types";

export const getCategories = () => http<Category[]>("/categories");

export const createCategory = (name: string) =>
  http<Category>("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const updateCategory = (id: number, name: string) =>
  http<Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });

export const deleteCategory = (id: number) =>
  http<void>(`/categories/${id}`, {
    method: "DELETE",
  });
