import { TransactionProvider } from "./context/TransactionContext";
import { RoleProvider } from "./context/RoleContext";
import { UIProvider } from "./context/UIContext";
import { useUI } from "./context/UIContext";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./components/dashboard/Dashboard";
import Transactions from "./components/transactions/Transactions";
import Insights from "./components/insights/Insights";
import TransactionModal from "./components/transactions/TransactionModal";
import DeleteConfirmDialog from "./components/transactions/DeleteConfirmDialog";
import ToastContainer from "./components/ui/Toast";

function AppShell() {
  const { activeTab, darkMode } = useUI();
  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-[#0d1117] text-white" : "bg-gray-50 text-gray-900"}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "transactions" && <Transactions />}
          {activeTab === "insights" && <Insights />}
        </main>
      </div>
      <TransactionModal />
      <DeleteConfirmDialog />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <UIProvider>
      <RoleProvider>
        <TransactionProvider>
          <AppShell />
        </TransactionProvider>
      </RoleProvider>
    </UIProvider>
  );
}