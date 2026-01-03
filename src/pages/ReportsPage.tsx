import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  BarChart,
  Bar,
} from "recharts";
import {
  getMonthlySpend,
  getCategoryWiseSpend,
  getShopWiseSavings,
} from "../api/reports.api";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626", "#7c3aed"];

export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeShop, setActiveShop] = useState<string | null>(null);

  const { data: monthly = [] } = useQuery({
    queryKey: ["monthly-spend"],
    queryFn: getMonthlySpend,
  });

  const { data: category = [] } = useQuery({
    queryKey: ["category-wise"],
    queryFn: getCategoryWiseSpend,
  });

  const { data: savings = [] } = useQuery({
    queryKey: ["shop-wise-savings"],
    queryFn: getShopWiseSavings,
  });

  /* ============================
     Normalize numbers (IMPORTANT)
  ============================ */
  const normalizedMonthly = monthly.map((m) => ({
    month: m.month,
    totalSpent: Number(m.totalSpent) || 0,
  }));

  const normalizedCategory = category.map((c) => ({
    category: c.category,
    totalSpent: Number(c.totalSpent) || 0,
  }));

  const normalizedSavings = savings.map((s) => ({
    shop: s.shop,
    totalSaved: Number(s.totalSaved) || 0,
  }));

  /* ============================
     Summary Calculations
  ============================ */
  const totalSpend = normalizedCategory.reduce(
    (sum, c) => sum + c.totalSpent,
    0
  );

  const totalSavings = normalizedSavings.reduce(
    (sum, s) => sum + s.totalSaved,
    0
  );

  const avgMonthlySpend =
    normalizedMonthly.length > 0 ? totalSpend / normalizedMonthly.length : 0;

  const highestSpendingMonth = normalizedMonthly.reduce(
    (max, m) => (m.totalSpent > (max?.totalSpent ?? 0) ? m : max),
    null as null | { month: string; totalSpent: number }
  );

  const topCategory = normalizedCategory.reduce(
    (max, c) => (c.totalSpent > (max?.totalSpent ?? 0) ? c : max),
    null as null | { category: string; totalSpent: number }
  );

  const mostSavingShop = normalizedSavings.reduce(
    (max, s) => (s.totalSaved > (max?.totalSaved ?? 0) ? s : max),
    null as null | { shop: string; totalSaved: number }
  );

  /* ============================
     Trend Arrow (Monthly)
  ============================ */
  const monthlyTrend =
    normalizedMonthly.length >= 2
      ? normalizedMonthly.at(-1)!.totalSpent -
        normalizedMonthly.at(-2)!.totalSpent
      : 0;

  const trendUp = monthlyTrend > 0;

  /* ============================
     Filtered Chart Data
  ============================ */
  const filteredCategory = activeCategory
    ? normalizedCategory.filter((c) => c.category === activeCategory)
    : normalizedCategory;

  const filteredSavings = activeShop
    ? normalizedSavings.filter((s) => s.shop === activeShop)
    : normalizedSavings;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Reports</h1>

      {/* ============================
         Summary Cards
      ============================ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded p-4">
          <p className="text-sm text-muted-foreground">Total Spend</p>
          <p className="text-xl font-semibold">₹{totalSpend.toFixed(2)}</p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-muted-foreground">Total Savings</p>
          <p className="text-xl font-semibold text-green-600">
            ₹{totalSavings.toFixed(2)}
          </p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-muted-foreground">Avg Monthly Spend</p>
          <p className="text-xl font-semibold">₹{avgMonthlySpend.toFixed(2)}</p>
          <p
            className={`text-sm font-medium ${
              trendUp ? "text-red-600" : "text-green-600"
            }`}
          >
            {trendUp ? "↑ Increased" : "↓ Decreased"}
          </p>
        </div>

        <div
          className="border rounded p-4 cursor-pointer hover:bg-accent"
          onClick={() =>
            setActiveCategory(
              activeCategory === topCategory?.category
                ? null
                : topCategory?.category ?? null
            )
          }
        >
          <p className="text-sm text-muted-foreground">Top Category</p>
          <p className="text-xl font-semibold">
            {topCategory?.category ?? "—"}
          </p>
        </div>
      </div>

      {/* ============================
         Highest / Saving Cards
      ============================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <p className="text-sm text-muted-foreground">
            Highest Spending Month
          </p>
          <p className="text-lg font-semibold">
            {highestSpendingMonth
              ? new Date(highestSpendingMonth.month).toLocaleDateString(
                  "en-IN",
                  { month: "short", year: "numeric" }
                )
              : "—"}
          </p>
          <p className="text-sm">
            ₹{highestSpendingMonth?.totalSpent.toFixed(2) ?? "0.00"}
          </p>
        </div>

        <div
          className="border rounded p-4 cursor-pointer hover:bg-accent"
          onClick={() =>
            setActiveShop(
              activeShop === mostSavingShop?.shop
                ? null
                : mostSavingShop?.shop ?? null
            )
          }
        >
          <p className="text-sm text-muted-foreground">Most Saving Shop</p>
          <p className="text-lg font-semibold">{mostSavingShop?.shop ?? "—"}</p>
          <p className="text-sm text-green-600">
            ₹{mostSavingShop?.totalSaved.toFixed(2) ?? "0.00"}
          </p>
        </div>
      </div>

      {/* ============================
         Charts
      ============================ */}
      <section>
        <h2 className="font-medium mb-2">Monthly Spend</h2>
        <div className="h-72 border rounded p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={normalizedMonthly}>
              <XAxis
                dataKey="month"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })
                }
              />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
                  return `₹${value}`;
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalSpent"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-2">Category-wise Spend</h2>
        <div className="h-72 border rounded p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredCategory}
                dataKey="totalSpent"
                nameKey="category"
                outerRadius={100}
                label
              >
                {filteredCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-2">Shop-wise Savings</h2>
        <div className="h-72 border rounded p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredSavings}>
              <XAxis dataKey="shop" />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
                  return `₹${value}`;
                }}
              />
              <Tooltip />
              <Bar dataKey="totalSaved" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
