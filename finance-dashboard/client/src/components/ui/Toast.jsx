import { useUI } from "../../context/UIContext";

const ICONS = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const COLORS = {
  success: "bg-emerald-600",
  error: "bg-red-600",
  info: "bg-violet-600",
  warning: "bg-amber-500",
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useUI();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm
            font-medium shadow-2xl min-w-[240px] max-w-xs
            animate-[slideIn_0.3s_ease-out]
            ${COLORS[toast.type] || COLORS.info}
          `}
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {ICONS[toast.type] || ICONS.info}
          </span>
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-white/60 hover:text-white text-lg leading-none ml-1"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}