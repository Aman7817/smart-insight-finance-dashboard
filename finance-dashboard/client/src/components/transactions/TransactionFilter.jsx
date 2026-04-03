import { useTransactions } from "../../context/TransactionContext";
import { useUI } from "../../context/UIContext";
import { CATEGORIES } from "../../data/mockData";

export default function TransactionFilters() {
  const { filters, search, setFilter, setSearch, resetFilters } = useTransactions();
  const { darkMode } = useUI();

  const inputClass = `
    w-full rounded-xl px-3 py-2 text-sm border outline-none transition-colors
    ${darkMode
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-violet-500/50 focus:bg-white/8"
      : "bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-violet-400 shadow-sm"
    }
  `;

  const labelClass = `block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
    darkMode ? "text-white/35" : "text-gray-400"
  }`;

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountMin ||
    filters.amountMax ||
    search;

  return (
    <div
      className={`rounded-2xl p-5 ${
        darkMode
          ? "bg-white/5 border border-white/8"
          : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>
          Filters & Search
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
              darkMode
                ? "text-rose-400 hover:bg-rose-500/10"
                : "text-rose-500 hover:bg-rose-50"
            }`}
          >
            Reset all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Search */}
        <div className="col-span-2 md:col-span-3 xl:col-span-2">
          <label className={labelClass}>Search</label>
          <input
            type="text"
            placeholder="Description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Type */}
        <div>
          <label className={labelClass}>Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilter("type", e.target.value)}
            className={inputClass}
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
            className={inputClass}
          >
            <option value="all">All categories</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <div>
          <label className={labelClass}>From date</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilter("dateFrom", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Date to */}
        <div>
          <label className={labelClass}>To date</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilter("dateTo", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}