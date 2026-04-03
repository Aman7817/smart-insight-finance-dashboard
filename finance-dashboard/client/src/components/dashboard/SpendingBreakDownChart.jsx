import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTransactions } from "../../context/TransactionContext";
import { useUI } from "../../context/UIContext";
import { CATEGORIES } from "../../data/mockData";
import { formatCurrency } from "../../utils/format";

const CustomTooltip = ({ active, payload, darkMode }) => {
  if (!active || !payload?.length) return null;
  const { category, total } = payload[0].payload;
  const cat = CATEGORIES[category];
  return (
    <div
      className={`p-3 rounded-xl border text-sm shadow-xl ${
        darkMode
          ? "bg-[#1a1f2e] border-white/10 text-white"
          : "bg-white border-gray-100 text-gray-800"
      }`}
    >
      <p className="font-bold">{cat?.icon} {cat?.label || category}</p>
      <p className="font-black text-lg mt-1">{formatCurrency(total)}</p>
    </div>
  );
};

export default function SpendingBreakdownChart() {
  const { categoryBreakdown } = useTransactions();
  const { darkMode } = useUI();

  const data = categoryBreakdown.slice(0, 6).map((d) => ({
    ...d,
    fill: CATEGORIES[d.category]?.color || "#94a3b8",
    label: CATEGORIES[d.category]?.label || d.category,
    icon: CATEGORIES[d.category]?.icon || "📦",
  }));

  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <div
      className={`rounded-2xl p-5 ${
        darkMode
          ? "bg-white/5 border border-white/8"
          : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <div className="mb-5">
        <h3 className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
          Spending Breakdown
        </h3>
        <p className={`text-xs mt-0.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
          Top categories by expense
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="total"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-white/30" : "text-gray-400"}`}>
              Total
            </p>
            <p className={`text-lg font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
              {formatCurrency(total, true)}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {data.map((d) => {
            const pct = total > 0 ? ((d.total / total) * 100).toFixed(0) : 0;
            return (
              <div key={d.category} className="flex items-center gap-2">
                <span className="text-sm flex-shrink-0">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-xs font-medium truncate ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                      {d.label}
                    </span>
                    <span className={`text-xs font-bold ml-2 flex-shrink-0 ${darkMode ? "text-white/50" : "text-gray-400"}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className={`h-1 rounded-full overflow-hidden ${darkMode ? "bg-white/8" : "bg-gray-100"}`}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: d.fill }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}