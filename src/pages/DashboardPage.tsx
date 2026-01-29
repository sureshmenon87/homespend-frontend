import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { getMonthlySpend, getCategoryWiseSpend } from "@/api/reports.api";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

export default function DashboardPage() {
  const [monthly, setMonthly] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getMonthlySpend().then(setMonthly);
    getCategoryWiseSpend().then(setCategories);
  }, []);

  const totalSpend = categories.reduce((sum, c) => sum + c.totalSpent, 0);

  const pieData = categories.map((c) => ({
    ...c,
    percent: ((c.totalSpent / totalSpend) * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard title="Total Spend" value={`₹${totalSpend.toFixed(0)}`} />
        <SummaryCard
          title="Top Category"
          value={categories[0]?.category ?? "-"}
        />
        <SummaryCard title="Months Tracked" value={monthly.length} />
      </div>

      {/* MONTHLY SPEND */}
      <div className="bg-card text-app border border-app rounded">
        <h3>Monthly Spend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthly}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}K`} />
            <Tooltip formatter={(v: number) => `₹${v}`} />
            <Line
              type="monotone"
              dataKey="totalSpent"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-card text-app border border-app rounded p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
