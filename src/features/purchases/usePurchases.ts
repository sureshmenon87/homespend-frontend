// src/features/purchases/usePurchases.ts
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Purchase, PurchaseFormData } from "./types";

const API_BASE = "http://localhost:3000/api";

export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------
  // Fetch all purchases
  // ---------------------------
  async function fetchPurchases(filters?: {
    search?: string;
    from?: string;
    to?: string;
  }) {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters?.search) {
        params.append("search", filters.search);
      }

      if (filters?.from) {
        params.append(
          "from",
          new Date(`${filters.from}T00:00:00.000Z`).toISOString()
        );
      }

      if (filters?.to) {
        params.append(
          "to",
          new Date(`${filters.to}T23:59:59.999Z`).toISOString()
        );
      }

      const url =
        params.toString().length > 0
          ? `${API_BASE}/purchases?${params.toString()}`
          : `${API_BASE}/purchases`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch purchases");

      const data: Purchase[] = await res.json();
      // setPurchases(data);
      setPurchases(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------
  // Add purchase
  // ---------------------------
  async function addPurchase(data: PurchaseFormData) {
    setIsAdding(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to add purchase");
      toast("Your purchase was saved successfully");

      await fetchPurchases(); // refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      toast("Failed to save purchase");
    } finally {
      setIsAdding(false);
    }
  }

  // ---------------------------
  // Delete purchase
  // ---------------------------
  async function deletePurchase(id: number) {
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/purchases/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete purchase");
      toast("Deleted successfully");
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function updatePurchase(id: number, data: PurchaseFormData) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/purchases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          mrp: data.mrp || data.unitPrice,
        }),
      });

      if (!res.ok) throw new Error("Failed to update purchase");

      const updated = await res.json();

      setPurchases((prev) => prev.map((p) => (p.id === id ? updated : p)));

      toast("Updated successfully");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPurchases();
  }, []);

  return {
    purchases,
    loading,
    isAdding,
    error,
    fetchPurchases,
    addPurchase,
    deletePurchase,
    updatePurchase,
  };
}
