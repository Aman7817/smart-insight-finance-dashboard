import { useUI } from "../../context/UIContext";
import { useRole } from "../../context/RoleContext";
import { useTransactions } from "../../context/TransactionContext";
import { formatCurrency } from "../../utils/format";

const TAB_TITLES = {
  dashboard: { title: "Dashboard", subtitle: "Your financial overview" },
  transactions: { title: "Transactions", subtitle: "Track every penny" },
  insights: { title: "Insights", subtitle: "Understand your spending" },
};

export default function Header() {
  const { activeTab, darkMode, toggleSidebar, openAddModal } = useUI();
  const { currentRole, roleConfig, can } = useRole();
  const { summary } = useTransactions();
  const { title, subtitle } = TAB_TITLES[activeTab] || TAB_TITLES.dashboard;

  return (
    <header
      className={`
        sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-4
        border-b backdrop-blur-xl
        ${darkMode
          ? "bg-[#0d1117]/90 border-white/5 text-white"
          : "bg-white/90 border-gray-100 text-gray-900"
        }
      `}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-bold leading-none">{title}</h2>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: balance pill + role badge + add button */}
      <div className="flex items-center gap-3">
        {/* Balance pill - hidden on small mobile */}
        <div
          className={`
            hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold
            ${summary.balance >= 0
              ? darkMode ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600"
              : darkMode ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-600"
            }
          `}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {formatCurrency(summary.balance, true)} net
        </div>

        {/* Role badge */}
        <span
          className={`
            hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
            ${darkMode ? "bg-white/8 text-white/60" : "bg-gray-100 text-gray-500"}
          `}
        >
          {roleConfig.icon}
          <span className="uppercase tracking-wider">{currentRole}</span>
        </span>

        {/* Add Transaction */}
        {can("canAddTransaction") && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add</span>
          </button>
        )}
      </div>
    </header>
  );
}