import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";

interface Filters {
  search?: string;
  from?: string;
  to?: string;
}

interface Props {
  filters: Filters;
  onChange: (value: Filters) => void;
}

export function PurchasesFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* Search */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-muted-foreground">Search</label>
        <Input
          className="w-[260px]"
          placeholder="Search item or shop..."
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* From */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-muted-foreground">From</label>
        <Input
          type="date"
          value={filters.from ?? ""}
          onChange={(e) => onChange({ ...filters, from: e.target.value })}
        />
      </div>

      {/* To */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-muted-foreground">To</label>
        <Input
          type="date"
          value={filters.to ?? ""}
          onChange={(e) => onChange({ ...filters, to: e.target.value })}
        />
      </div>

      {/* Clear */}
      {(filters.search || filters.from || filters.to) && (
        <Button
          variant="ghost"
          size="icon"
          className="mb-1"
          onClick={() => onChange({})}
          title="Clear filters"
        >
          ✕
        </Button>
      )}
    </div>
  );
}
