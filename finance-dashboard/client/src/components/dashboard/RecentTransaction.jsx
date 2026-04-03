import { useTransactions } from "../../context/TransactionContext";
import { useUI } from "../../context/UIContext";
import { CATEGORIES } from "../../data/mockData";
import { formatCurrency, formatDate } from "../../utils/format";

export default function RecentTransactions() {
  const { transactions } = useTransactions();
  const { darkMode, setActiveTab, TABS } = useUI();

  // Last 6 transactions sorted by date
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <div
      className={`rounded-2xl p-5 ${
        darkMode
          ? "bg-white/5 border border-white/8"
          : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
            Recent Activity
          </h3>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            Latest transactions
          </p>
        </div>
        <button
          onClick={() => setActiveTab(TABS.TRANSACTIONS)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            darkMode
              ? "text-violet-400 hover:bg-violet-500/15"
              : "text-violet-600 hover:bg-violet-50"
          }`}
        >
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div className={`text-center py-10 ${darkMode ? "text-white/30" : "text-gray-300"}`}>
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((txn) => {
            const cat = CATEGORIES[txn.category];
            const isIncome = txn.type === "income";
            return (
              <div
                key={txn.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                }`}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ backgroundColor: (cat?.color || "#94a3b8") + "20" }}
                >
                  {cat?.icon || "📦"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${darkMode ? "text-white/90" : "text-gray-800"}`}>
                    {txn.description}
                  </p>
                  <p className={`text-xs ${darkMode ? "text-white/35" : "text-gray-400"}`}>
                    {cat?.label} · {formatDate(txn.date)}
                  </p>
                </div>

                {/* Amount */}
                <p
                  className={`text-sm font-black flex-shrink-0 ${
                    isIncome
                      ? "text-emerald-500"
                      : darkMode ? "text-white/80" : "text-gray-700"
                  }`}
                >
                  {isIncome ? "+" : "-"}{formatCurrency(txn.amount, true)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}