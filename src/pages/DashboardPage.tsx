import { useQuery } from "@tanstack/react-query";
import {
  getMonthlySpend,
  getCategoryWiseSpend,
  getShopWiseSavings,
} from "../api/reports.api";

export default function DashboardPage() {
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

  // Normalize numbers
  const monthlyData = monthly.map((m) => ({
    month: m.month,
    total: Number(m.totalSpent) || 0,
  }));

  const totalSavings = savings.reduce(
    (sum, s) => sum + Number(s.totalSaved || 0),
    0
  );

  const totalSpend = category.reduce(
    (sum, c) => sum + Number(c.totalSpent || 0),
    0
  );

  const currentMonth = monthlyData.at(-1);
  const lastMonth = monthlyData.at(-2);

  const avgMonthlySpend =
    monthlyData.length > 0 ? totalSpend / monthlyData.length : 0;

  const trend =
    currentMonth && lastMonth ? currentMonth.total - lastMonth.total : 0;

  const trendUp = trend > 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">
        Overview of your spending and savings.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded p-4">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-xl font-semibold">
            ₹{currentMonth?.total.toFixed(2) ?? "0.00"}
          </p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-muted-foreground">Last Month</p>
          <p className="text-xl font-semibold">
            ₹{lastMonth?.total.toFixed(2) ?? "0.00"}
          </p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-muted-foreground">Total Savings</p>
          <p className="text-xl font-semibold text-green-600">
            ₹{totalSavings.toFixed(2)}
          </p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-muted-foreground">Avg / Month</p>
          <p className="text-xl font-semibold">₹{avgMonthlySpend.toFixed(2)}</p>
          <p
            className={`text-sm font-medium ${
              trendUp ? "text-red-600" : "text-green-600"
            }`}
          >
            {trendUp ? "↑ Spending increased" : "↓ Spending reduced"}
          </p>
        </div>
      </div>
    </div>
  );
}
