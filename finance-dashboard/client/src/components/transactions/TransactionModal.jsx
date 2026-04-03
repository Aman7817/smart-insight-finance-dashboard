import { useState, useEffect } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { useUI } from "../../context/UIContext";
import { CATEGORIES } from "../../data/mockData";
import { today } from "../../utils/format";

export default function TransactionModal() {
  const { addTransaction, editTransaction } = useTransactions();
  const { modal, closeModal, showToast, darkMode } = useUI();
  const { open, mode, transaction } = modal;

  const blank = {
    description: "",
    amount: "",
    category: "FOOD",
    type: "expense",
    date: today(),
  };

  const getInitialForm = () => {
    if (mode === "edit" && transaction) {
      return { ...transaction, amount: String(transaction.amount) };
    }
    return blank;
  };

  const [form, setForm] = useState(getInitialForm());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(getInitialForm());
      setErrors({});
    }
  }, [open, mode, transaction]);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
      e.amount = "Enter a valid positive amount";
    if (!form.date) e.date = "Date is required";
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = { ...form, amount: parseFloat(form.amount) };
    if (mode === "edit") {
      editTransaction(payload);
      showToast("Transaction updated!", "success");
    } else {
      addTransaction(payload);
      showToast("Transaction added!", "success");
    }
    closeModal();
  };

  if (!open) return null;

  const inputClass = (err) => `
    w-full rounded-xl px-3.5 py-2.5 text-sm border outline-none transition-colors
    ${darkMode
      ? `bg-white/5 text-white placeholder:text-white/25 ${err ? "border-rose-500/60" : "border-white/10 focus:border-violet-500/60"}`
      : `bg-white text-gray-800 placeholder:text-gray-400 shadow-sm ${err ? "border-rose-400" : "border-gray-200 focus:border-violet-400"}`
    }
  `;

  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-white/40" : "text-gray-500"}`;
  const errClass = `text-rose-400 text-xs mt-1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl animate-[modalIn_0.25s_ease-out] ${
          darkMode
            ? "bg-[#111827] border border-white/10"
            : "bg-white border border-gray-100"
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-5 border-b ${darkMode ? "border-white/8" : "border-gray-100"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                {mode === "edit" ? "Edit Transaction" : "Add Transaction"}
              </h2>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-white/35" : "text-gray-400"}`}>
                {mode === "edit" ? "Update the transaction details" : "Record a new transaction"}
              </p>
            </div>
            <button
              onClick={closeModal}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-colors ${
                darkMode ? "text-white/40 hover:bg-white/10 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              }`}
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Type toggle */}
          <div>
            <label className={labelClass}>Type</label>
            <div className={`flex rounded-xl p-1 ${darkMode ? "bg-white/5" : "bg-gray-100"}`}>
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  onClick={() => set("type", t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    form.type === t
                      ? t === "income"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-rose-600 text-white shadow-sm"
                      : darkMode ? "text-white/35 hover:text-white/60" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t === "income" ? "↑ Income" : "↓ Expense"}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              placeholder="e.g. Grocery Store, Salary..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputClass(errors.description)}
            />
            {errors.description && <p className={errClass}>{errors.description}</p>}
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Amount (₹)</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                className={inputClass(errors.amount)}
              />
              {errors.amount && <p className={errClass}>{errors.amount}</p>}
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={inputClass(errors.date)}
              />
              {errors.date && <p className={errClass}>{errors.date}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClass(false)}
            >
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex gap-3 ${darkMode ? "border-white/8" : "border-gray-100"}`}>
          <button
            onClick={closeModal}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              darkMode
                ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all shadow-md shadow-violet-500/25"
          >
            {mode === "edit" ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}