import { useUI } from "../../context/UIContext";
import { useRole } from "../../context/RoleContext";

const NAV_ITEMS = [
  { tab: "dashboard", label: "Dashboard", icon: "⬡" },
  { tab: "transactions", label: "Transactions", icon: "⇄" },
  { tab: "insights", label: "Insights", icon: "◈" },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, darkMode, toggleDarkMode, TABS, closeSidebar, sidebarOpen } = useUI();
  const { currentRole, allRoles, switchRole, roleConfig } = useRole();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    closeSidebar();
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:relative lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${darkMode
            ? "bg-[#0f1117] border-r border-white/5"
            : "bg-[#0a0f1e] border-r border-white/5"
          }
        `}
      >
        {/* Logo */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-violet-500/30">
              F
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight leading-none">Fintrack</h1>
              <p className="text-white/40 text-xs mt-0.5 font-mono">v2.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 flex-1">
          <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">
            Navigation
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ tab, label, icon }) => {
              const isActive = activeTab === tab;
              return (
                <li key={tab}>
                  <button
                    onClick={() => handleTabClick(tab)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200 group text-left
                      ${isActive
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                      }
                    `}
                  >
                    <span className={`text-xl transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                      {icon}
                    </span>
                    <span className="tracking-wide">{label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Role switcher */}
        <div className="mx-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2">
            Role
          </p>
          <div className="flex gap-1.5">
            {allRoles.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => switchRole(key)}
                className={`
                  flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200
                  ${currentRole === key
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                    : "bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10"
                  }
                `}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <p className="text-white/25 text-[10px] mt-2 leading-tight">
            {roleConfig.description}
          </p>
        </div>

        {/* Dark mode toggle */}
        <div className="px-6 py-5 border-t border-white/5 flex items-center justify-between">
          <span className="text-white/40 text-xs font-medium">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className={`
              relative w-10 h-5 rounded-full transition-colors duration-300
              ${darkMode ? "bg-violet-600" : "bg-white/20"}
            `}
          >
            <span
              className={`
                absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300
                ${darkMode ? "left-5" : "left-0.5"}
              `}
            />
          </button>
        </div>
      </aside>
    </>
  );
}