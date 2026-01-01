import { api } from "./client";

export type Category = { id: number; name: string };
export type Item = { id: number; name: string; categoryId: number };
export type Shop = { id: number; name: string };

export const getCategories = () => api<Category[]>("/categories");

export const getItems = () => api<Item[]>("/items");

export const getShops = () => api<Shop[]>("/shops");
