import { useTransactions } from "../../context/TransactionContext";
import { useUI } from "../../context/UIContext";
import { useRole } from "../../context/RoleContext";
import { CATEGORIES } from "../../data/mockData";
import { formatCurrency, formatDate } from "../../utils/format";

const SortButton = ({ field, label, currentSort, onSort, darkMode }) => {
  const isActive = currentSort.field === field;
  const dir = currentSort.direction;
  return (
    <button
      onClick={() => onSort(field)}
      className={`
        flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors
        ${isActive
          ? darkMode ? "text-violet-400" : "text-violet-600"
          : darkMode ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"
        }
      `}
    >
      {label}
      {isActive && <span>{dir === "asc" ? " ↑" : " ↓"}</span>}
    </button>
  );
};

export default function TransactionList() {
  const { filteredTransactions, sort, setSort } = useTransactions();
  const { darkMode, openEditModal, openDeleteConfirm } = useUI();
  const { can } = useRole();

  const thClass = `px-4 py-3 text-left`;
  const tdClass = `px-4 py-3.5`;

  if (filteredTransactions.length === 0) {
    return (
      <div
        className={`rounded-2xl p-12 text-center ${
          darkMode
            ? "bg-white/5 border border-white/8"
            : "bg-white border border-gray-100 shadow-sm"
        }`}
      >
        <p className="text-4xl mb-3">🔍</p>
        <p className={`font-semibold ${darkMode ? "text-white/60" : "text-gray-500"}`}>
          No transactions match your filters
        </p>
        <p className={`text-sm mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>
          Try adjusting or resetting the filters above
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden ${
        darkMode
          ? "bg-white/5 border border-white/8"
          : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      {/* Count bar */}
      <div
        className={`px-5 py-3 flex items-center justify-between border-b ${
          darkMode ? "border-white/5 text-white/40" : "border-gray-100 text-gray-400"
        }`}
      >
        <span className="text-xs font-semibold">
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={darkMode ? "border-b border-white/5" : "border-b border-gray-100"}>
              <th className={thClass}>
                <SortButton field="date" label="Date" currentSort={sort} onSort={setSort} darkMode={darkMode} />
              </th>
              <th className={thClass}>
                <SortButton field="description" label="Description" currentSort={sort} onSort={setSort} darkMode={darkMode} />
              </th>
              <th className={thClass}>
                <SortButton field="category" label="Category" currentSort={sort} onSort={setSort} darkMode={darkMode} />
              </th>
              <th className={thClass}>
                <SortButton field="amount" label="Amount" currentSort={sort} onSort={setSort} darkMode={darkMode} />
              </th>
              <th className={`${thClass} text-center`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-white/30" : "text-gray-400"}`}>
                  Type
                </span>
              </th>
              {(can("canEditTransaction") || can("canDeleteTransaction")) && (
                <th className={`${thClass} text-right`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-white/30" : "text-gray-400"}`}>
                    Actions
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn, idx) => {
              const cat = CATEGORIES[txn.category];
              const isIncome = txn.type === "income";
              return (
                <tr
                  key={txn.id}
                  className={`
                    transition-colors
                    ${darkMode
                      ? idx % 2 === 0 ? "bg-white/[0.02]" : "" + " hover:bg-white/5"
                      : idx % 2 === 0 ? "bg-gray-50/50" : "" + " hover:bg-violet-50/30"
                    }
                  `}
                >
                  <td className={`${tdClass} text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                    {formatDate(txn.date)}
                  </td>
                  <td className={`${tdClass}`}>
                    <span className={`text-sm font-semibold ${darkMode ? "text-white/85" : "text-gray-800"}`}>
                      {txn.description}
                    </span>
                  </td>
                  <td className={tdClass}>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        backgroundColor: (cat?.color || "#94a3b8") + "20",
                        color: cat?.color || "#94a3b8",
                      }}
                    >
                      {cat?.icon} {cat?.label || txn.category}
                    </span>
                  </td>
                  <td className={`${tdClass} text-sm font-black ${isIncome ? "text-emerald-500" : darkMode ? "text-white/80" : "text-gray-700"}`}>
                    {isIncome ? "+" : "-"}{formatCurrency(txn.amount)}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isIncome
                          ? darkMode ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                          : darkMode ? "bg-rose-500/15 text-rose-400" : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  {(can("canEditTransaction") || can("canDeleteTransaction")) && (
                    <td className={`${tdClass} text-right`}>
                      <div className="flex items-center justify-end gap-2">
                        {can("canEditTransaction") && (
                          <button
                            onClick={() => openEditModal(txn)}
                            className={`p-1.5 rounded-lg text-xs transition-colors ${
                              darkMode
                                ? "text-white/30 hover:text-violet-400 hover:bg-violet-500/10"
                                : "text-gray-400 hover:text-violet-600 hover:bg-violet-50"
                            }`}
                          >
                            ✎
                          </button>
                        )}
                        {can("canDeleteTransaction") && (
                          <button
                            onClick={() => openDeleteConfirm(txn.id, txn.description)}
                            className={`p-1.5 rounded-lg text-xs transition-colors ${
                              darkMode
                                ? "text-white/30 hover:text-rose-400 hover:bg-rose-500/10"
                                : "text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-white/5">
        {filteredTransactions.map((txn) => {
          const cat = CATEGORIES[txn.category];
          const isIncome = txn.type === "income";
          return (
            <div key={txn.id} className="px-4 py-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ backgroundColor: (cat?.color || "#94a3b8") + "20" }}
              >
                {cat?.icon || "📦"}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${darkMode ? "text-white/90" : "text-gray-800"}`}>
                  {txn.description}
                </p>
                <p className={`text-xs ${darkMode ? "text-white/35" : "text-gray-400"}`}>
                  {cat?.label} · {formatDate(txn.date)}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-black ${isIncome ? "text-emerald-500" : darkMode ? "text-white/80" : "text-gray-700"}`}>
                  {isIncome ? "+" : "-"}{formatCurrency(txn.amount, true)}
                </p>
                {(can("canEditTransaction") || can("canDeleteTransaction")) && (
                  <div className="flex gap-2 justify-end mt-1">
                    {can("canEditTransaction") && (
                      <button onClick={() => openEditModal(txn)} className="text-violet-400 text-xs">Edit</button>
                    )}
                    {can("canDeleteTransaction") && (
                      <button onClick={() => openDeleteConfirm(txn.id, txn.description)} className="text-rose-400 text-xs">Del</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}