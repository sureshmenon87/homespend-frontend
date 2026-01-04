import { http } from "./http";
import type { Category } from "../features/categories/types";

export const getCategories = () => http<Category[]>("/categories");

export const createCategory = (name: string, description: string) =>
  http<Category>("/categories", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });

export const updateCategory = (id: number, name: string, description: string) =>
  http<Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, description }),
  });

export const deleteCategory = (id: number) =>
  http<void>(`/categories/${id}`, {
    method: "DELETE",
  });
