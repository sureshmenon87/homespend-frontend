import { fetchPurchases } from "@/api/purchases.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PurchasesFilters } from "@/features/purchases/PurchasesFilters";
import { PurchasesTable } from "@/features/purchases/PurchasesTable";
import type { Purchase, PurchaseFormData } from "@/features/purchases/types";
import { usePurchases } from "@/features/purchases/usePurchases";

import { Plus } from "lucide-react";
import { AddPurchaseDialog } from "../features/purchases/AddPurchaseDialog";
import { useEffect, useState } from "react";

export function PurchasesPage() {
  const [filters, setFilters] = useState<{
    search?: string;
    from?: string;
    to?: string;
  }>({});
  const {
    purchases,
    loading,
    error,

    pageSize,
    total,

    setPageSize,
    fetchPurchases,
    addPurchase,
    updatePurchase,
    deletePurchase,
  } = usePurchases(filters);

  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const totalPages = Math.ceil(total / limit);

  // 🔑 SINGLE EFFECT – everything flows from here
  useEffect(() => {
    fetchPurchases({
      ...filters,
      page,
      limit,
    });
  }, [filters, page, limit]);

  function handleEdit(purchase: Purchase) {
    setEditingPurchase(purchase);
    setDialogOpen(true);
  }

  const handleSuccess = () => {
    fetchPurchases(filters);
  };

  function handleAdd() {
    setEditingPurchase(null);
    setDialogOpen(true);
  }

  async function handleSave(data: PurchaseFormData) {
    if (editingPurchase) {
      await updatePurchase(editingPurchase.id, data);
    } else {
      await addPurchase(data);
    }

    // 🔑 refresh list OR rely on optimistic update
    await fetchPurchases();

    setDialogOpen(false);
    setEditingPurchase(null);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Purchases</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your grocery and daily expenses.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPurchase(null);
            setDialogOpen(true);
            console.log("Clicked...");
          }}
          className="flex items-center gap-2"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          Add Purchase
        </Button>
        <AddPurchaseDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingPurchase={editingPurchase}
          onSuccess={handleSuccess}
        />
      </div>
      {/* Filters */}
      <PurchasesFilters
        filters={filters}
        onChange={(next) => {
          setPage(1); // reset page on filter change
          setFilters(next);
        }}
      />
      {/* Table */}
      <Card className="bg-card text-app border border-app rounded">
        <CardHeader className="pb-3">
          <h3 className="text-sm font-medium">Recent purchases</h3>
        </CardHeader>
        <CardContent>
          <PurchasesTable
            data={purchases}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={deletePurchase}
          />
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Page size */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
                className="border border-app rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span className="text-sm">
                Page <strong>{page}</strong> of{" "}
                <strong>{totalPages || 1}</strong>
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
