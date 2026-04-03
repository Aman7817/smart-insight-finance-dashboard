import { useTransactions } from "../../context/TransactionContext";
import { useUI } from "../../context/UIContext";
import { formatCurrency } from "../../utils/format";

const cards = [
  {
    key: "balance",
    label: "Net Balance",
    getValue: (s) => s.balance,
    icon: "◈",
    gradient: "from-violet-600 to-indigo-600",
    glow: "shadow-violet-500/30",
    positive: true,
  },
  {
    key: "income",
    label: "Total Income",
    getValue: (s) => s.totalIncome,
    icon: "↑",
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/30",
    positive: true,
  },
  {
    key: "expense",
    label: "Total Expenses",
    getValue: (s) => s.totalExpense,
    icon: "↓",
    gradient: "from-rose-500 to-orange-500",
    glow: "shadow-rose-500/30",
    positive: false,
  },
  {
    key: "count",
    label: "Transactions",
    getValue: (s) => s.transactionCount,
    isCount: true,
    icon: "⇄",
    gradient: "from-amber-500 to-yellow-400",
    glow: "shadow-amber-500/30",
    positive: true,
  },
];

export default function SummaryCards() {
  const { summary } = useTransactions();
  const { darkMode } = useUI();

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const value = card.getValue(summary);
        return (
          <div
            key={card.key}
            className={`
              relative rounded-2xl p-5 overflow-hidden
              transition-transform duration-200 hover:-translate-y-0.5
              ${darkMode
                ? "bg-white/5 border border-white/8 hover:bg-white/8"
                : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
              }
            `}
          >
            {/* Decorative gradient blob */}
            <div
              className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${card.gradient} opacity-15 blur-xl`}
            />

            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-lg font-bold shadow-lg ${card.glow} mb-4`}
            >
              {card.icon}
            </div>

            {/* Value */}
            <p className={`text-2xl font-black tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
              {card.isCount
                ? value.toLocaleString("en-IN")
                : formatCurrency(value, true)}
            </p>

            {/* Label */}
            <p className={`text-xs font-semibold uppercase tracking-widest mt-1.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              {card.label}
            </p>

            {/* Savings rate for balance card */}
            {card.key === "balance" && summary.totalIncome > 0 && (
              <div
                className={`
                  mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold
                  ${value >= 0
                    ? darkMode ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                    : darkMode ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-600"
                  }
                `}
              >
                {((value / summary.totalIncome) * 100).toFixed(0)}% savings rate
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}