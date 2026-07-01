import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiGrid,
  FiAlertTriangle,
  FiUsers,
  FiHome,
  FiNavigation,
  FiFileText,
  FiShield,
  FiMessageSquare,
  FiLogOut,
  FiX,
} from "react-icons/fi";

import { logout } from "../redux/features/authSlice";

// Nav structure per role. Keeping this as plain data (not split into a
// separate file) so the component stays self-contained.
const NAV_BY_ROLE = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: FiGrid },
    { to: "/emergencies", label: "Emergencies", icon: FiAlertTriangle },
    { to: "/responders", label: "Responders", icon: FiUsers },
    { to: "/shelters", label: "Shelters", icon: FiHome },
  ],
  responder: [
    { to: "/responder", label: "My Missions", icon: FiNavigation },
  ],
  citizen: [
    { to: "/citizen", label: "Overview", icon: FiGrid, end: true },
    { to: "/citizen/report", label: "Report Emergency", icon: FiAlertTriangle },
    { to: "/citizen/my-reports", label: "My Reports", icon: FiFileText },
    { to: "/citizen/safety", label: "Safety Resources", icon: FiShield },
    { to: "/citizen/feedback", label: "Feedback", icon: FiMessageSquare },
  ],
};

function Sidebar({ mobileOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const role = user?.user?.role;
  const navItems = NAV_BY_ROLE[role] || [];
  const initials = (user?.user?.name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 shrink-0 flex flex-col
          bg-[var(--bg-surface)] border-r border-[var(--border-subtle)]
          px-4 py-5
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-2.5">
            <span className="pulse-dot w-2.5 h-2.5 text-[var(--accent-emergency)]" />
            <h1 className="font-display text-xl font-bold tracking-tight">
              ResQNet
            </h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-[var(--text-muted)] hover:text-white p-1"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-[var(--accent-info-dim)] text-white"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={isActive ? "text-[var(--accent-info)]" : "text-[var(--text-muted)] group-hover:text-white"}
                  />
                  {label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-info)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
          {user?.user && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-info)] to-[var(--accent-safe)] flex items-center justify-center font-display text-sm font-semibold text-[#0a0e17] shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.user.name}</p>
                <p className="text-xs text-[var(--text-muted)] capitalize">{role}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center px-3 py-2.5 rounded-xl text-sm font-semibold bg-[var(--accent-emergency-dim)] text-[var(--accent-emergency)] hover:bg-[var(--accent-emergency)] hover:text-white transition-colors"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
