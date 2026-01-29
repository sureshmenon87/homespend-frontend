import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import {
  getMonthlySpend,
  getCategoryWiseSpend,
  getItemPriceTrend,
} from "@/api/reports.api";
import { getItems } from "@/api/items.api";
import type { PriceTrends } from "@/features/reports/types";
import React from "react";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

export default function ReportsPage() {
  const [monthly, setMonthly] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [itemId, setItemId] = useState<number>();
  const [priceData, setPriceData] = useState<PriceTrends[]>([]);
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");

  useEffect(() => {
    getMonthlySpend().then(setMonthly);
    getCategoryWiseSpend().then(setCategories);
    getItems().then(setItems);
  }, []);

  useEffect(() => {
    if (!itemId) return;

    getItemPriceTrend(itemId).then((data) => {
      setPriceData(data);
    });
  }, [itemId]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const total = categories.reduce((sum, c) => sum + c.totalSpent, 0);

  const pieData = categories.map((c) => ({
    ...c,
    percent: (c.totalSpent / total) * 100,
  }));

  const sortedPieData = React.useMemo(() => {
    return [...pieData].sort((a, b) => b.totalSpent - a.totalSpent);
  }, [pieData]);
  const filteredMonthly = activeCategory
    ? monthly.filter((m) => m.category === activeCategory)
    : monthly;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <div className="space-y-8">
      {/* MONTHLY */}

      {}

      {/* CATEGORY */}
      <Section title="Category-wise Spend">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={sortedPieData}
              dataKey="totalSpent"
              nameKey="category"
              innerRadius={70}
              outerRadius={110}
              activeIndex={activeIndex ?? undefined}
              activeShape={{ outerRadius: 120 }}
              onMouseEnter={(_, i) => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {sortedPieData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.category}`} // Use a unique name key, not index i
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              onClick={(e: any) =>
                setActiveCategory((prev) => (prev === e.value ? null : e.value))
              }
              formatter={(name, entry: any) =>
                `${name} (${entry?.payload?.percent?.toFixed(1) ?? "0"}%)`
              }
            />

            {/* Center total */}
            <text x="50%" y="50%" textAnchor="middle">
              ₹{total.toFixed(0)}
            </text>
            <text x="50%" y="58%" textAnchor="middle" fill="#666">
              Total Spend
            </text>

            <Tooltip formatter={(v: number) => `₹${v.toFixed(0)}`} />
          </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={filteredMonthly}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}K`} />
            <Tooltip formatter={(v: number) => `₹${v}`} />
            <Line
              type="monotone"
              dataKey="totalSpent"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* ITEM PRICE */}
      <Section title="Item Price Analysis">
        <div className="flex gap-4 mb-4">
          <select
            onChange={(e) => setItemId(Number(e.target.value))}
            className="border border-app p-2"
          >
            <option>Select item</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
            className="border border-app p-2"
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="area">Area</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          {chartType === "line" && (
            <LineChart data={priceData}>
              <XAxis dataKey="month" />
              <YAxis domain={[0, "dataMax + 5"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="unitPrice"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          )}

          {chartType === "bar" && (
            <BarChart data={priceData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="unitPrice" fill="#2563eb" />
            </BarChart>
          )}

          {chartType === "area" && (
            <AreaChart data={priceData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area dataKey="unitPrice" stroke="#2563eb" fill="#93c5fd" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card text-app border border-app rounded">
      <h3 className="mb-4">{title}</h3>
      {children}
    </div>
  );
}
