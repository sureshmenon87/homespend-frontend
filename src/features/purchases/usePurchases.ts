// src/features/purchases/usePurchases.ts
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Purchase, PurchaseFormData } from "./types";

//const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_BASE = "http://localhost:3000/api";

interface Filters {
  search?: string;
  from?: string;
  to?: string;
}

export function usePurchases(filters?: Filters) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // ---------------------------
  // Fetch all purchases
  // ---------------------------
  async function fetchPurchases(filters?: {
    search?: string;
    from?: string;
    to?: string;
    page?: number;
    limt?: number;
  }) {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams(filters as any).toString();
      const res = await fetch(`${API_BASE}/purchases?${params}`);
      const data = await res.json();
      setPurchases(data.data);
      setTotal(data.meta.total);
    } catch (err) {
      setError("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPurchases(filters);
  }, [pageSize]);
  // ---------------------------
  // Add purchase
  // ---------------------------
  async function addPurchase(data: PurchaseFormData) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          mrp: data.mrp ?? data.unitPrice,
        }),
      });

      if (!res.ok) throw new Error("Add failed");

      const created = await res.json();
      setPurchases((prev) => [created, ...prev]); // 👈 instant refresh
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------
  // Delete purchase
  // ---------------------------
  async function deletePurchase(id: number) {
    await fetch(`${API_BASE}/purchases/${id}`, { method: "DELETE" });
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  }

  async function updatePurchase(id: number, data: PurchaseFormData) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/purchases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          mrp: data.mrp ?? data.unitPrice,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setPurchases((prev) => prev.map((p) => (p.id === id ? updated : p)));
      // await fetchPurchases();
    } finally {
      setLoading(false);
    }
  }

  return {
    purchases,
    loading,

    error,
    fetchPurchases,
    addPurchase,
    deletePurchase,
    updatePurchase,
    // pagination
    page,
    pageSize,
    total,
    setPage,
    setPageSize,
  };
}
