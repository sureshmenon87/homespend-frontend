import { fetchPurchases } from "@/api/purchases.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PurchasesFilters } from "@/features/purchases/PurchasesFilters";
import { PurchasesTable } from "@/features/purchases/PurchasesTable";
import type { Purchase } from "@/features/purchases/types";
import { usePurchases } from "@/features/purchases/usePurchases";

import { Plus } from "lucide-react";
import { AddPurchaseDialog } from "../features/purchases/AddPurchaseDialog";
import { useEffect, useState } from "react";

export function PurchasesPage() {
  const { purchases, loading, error, fetchPurchases, deletePurchase } =
    usePurchases();
  const [open, setOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  function handleEdit(purchase: Purchase) {
    setEditingPurchase(purchase);
    setOpen(true);
  }

  function handleAdd() {
    setEditingPurchase(null);
    setDialogOpen(true);
  }
  const [filters, setFilters] = useState<{
    search?: string;
    from?: string;
    to?: string;
  }>({});

  useEffect(() => {
    fetchPurchases(filters);
  }, [filters]);
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
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          Add Purchase
        </Button>

        <AddPurchaseDialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setEditingPurchase(null);
          }}
          editingPurchase={editingPurchase}
        />
      </div>
      {/* Filters */}
      <PurchasesFilters filters={filters} onChange={setFilters} />
      {/* Table */}
      <Card>
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
        </CardContent>
      </Card>
    </div>
  );
}
