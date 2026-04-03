import SummaryCards from "./SummaryCards";
import BalanceTrendChart from "./BalanceTrendChart";
import SpendingBreakdownChart from "./SpendingBreakdownChart";
import RecentTransactions from "./RecentTransactions";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <BalanceTrendChart />
        </div>
        <div className="lg:col-span-2">
          <SpendingBreakdownChart />
        </div>
      </div>

      {/* Recent transactions */}
      <RecentTransactions />
    </div>
  );
}