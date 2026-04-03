import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useTransactions } from "../../context/TransactionContext";
import { useUI } from "../../context/UIContext";
import { formatCurrency } from "../../utils/format";

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div
      className={`p-3 rounded-xl border text-sm shadow-xl ${
        darkMode
          ? "bg-[#1a1f2e] border-white/10 text-white"
          : "bg-white border-gray-100 text-gray-800"
      }`}
    >
      <p className={`font-bold mb-2 ${darkMode ? "text-white/60" : "text-gray-400"}`}>{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          <span className={darkMode ? "text-white/50" : "text-gray-400"}>Balance</span>
          <span className="font-bold ml-auto">{formatCurrency(d?.balance, true)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className={darkMode ? "text-white/50" : "text-gray-400"}>Income</span>
          <span className="font-semibold ml-auto text-emerald-500">{formatCurrency(d?.income, true)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span className={darkMode ? "text-white/50" : "text-gray-400"}>Expense</span>
          <span className="font-semibold ml-auto text-rose-500">{formatCurrency(d?.expense, true)}</span>
        </div>
      </div>
    </div>
  );
};

export default function BalanceTrendChart() {
  const { monthlyData } = useTransactions();
  const { darkMode } = useUI();

  const axisColor = darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
  const gridColor = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";

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
            Balance Trend
          </h3>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            Monthly income vs expenses
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {[
            { color: "bg-violet-500", label: "Balance" },
            { color: "bg-emerald-400", label: "Income" },
            { color: "bg-rose-400", label: "Expense" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className={darkMode ? "text-white/50" : "text-gray-400"}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v, true)}
            width={60}
          />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={{ stroke: axisColor, strokeWidth: 1, strokeDasharray: "4 4" }} />
          <ReferenceLine y={0} stroke={axisColor} strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#34d399"
            strokeWidth={1.5}
            fill="url(#incomeGrad)"
            dot={false}
            strokeDasharray="4 2"
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            fill="url(#balanceGrad)"
            dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: "#8b5cf6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}