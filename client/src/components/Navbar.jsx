import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

// Route -> page context. Purely presentational: lets every dashboard route
// show a relevant title/subtitle without each page having to pass props.
const PAGE_CONTEXT = [
  { match: /^\/admin/, title: "Emergency Operations Center", subtitle: "Live overview of city-wide incidents" },
  { match: /^\/emergencies/, title: "Emergencies", subtitle: "All reported incidents" },
  { match: /^\/responders/, title: "Responders", subtitle: "Field responder roster" },
  { match: /^\/shelters/, title: "Shelters", subtitle: "Shelter capacity & resources" },
  { match: /^\/responder/, title: "My Missions", subtitle: "Assigned rescue missions" },
  { match: /^\/citizen\/report/, title: "Report Emergency", subtitle: "Send an SOS to nearby responders" },
  { match: /^\/citizen\/my-reports/, title: "My Reports", subtitle: "Track the emergencies you've reported" },
  { match: /^\/citizen\/safety/, title: "Safety Resources", subtitle: "Preparedness guides & emergency contacts" },
  { match: /^\/citizen\/feedback/, title: "Feedback", subtitle: "Help us improve ResQNet" },
  { match: /^\/citizen/, title: "Welcome back", subtitle: "Your safety, one tap away" },
];

function Navbar({ onMenuClick }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const context =
    PAGE_CONTEXT.find((c) => c.match.test(location.pathname)) || {
      title: "ResQNet",
      subtitle: "",
    };

  const initials = (user?.user?.name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="h-16 border-b border-[var(--border-subtle)] flex items-center justify-between px-4 sm:px-6 bg-[var(--bg-base)]/80 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[var(--text-muted)] hover:text-white p-1 shrink-0"
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>
        <div className="min-w-0">
          <h2 className="font-display font-semibold text-sm sm:text-base truncate">
            {context.title}
          </h2>
          {context.subtitle && (
            <p className="text-xs text-[var(--text-muted)] hidden sm:block truncate">
              {context.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden md:flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono-data">
          <span className="pulse-dot w-1.5 h-1.5 text-[var(--accent-safe)]" />
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>

        {user?.user?.name && (
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-tight">{user.user.name}</p>
              <p className="text-xs text-[var(--text-muted)] capitalize leading-tight">
                {user.user.role}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-info)] to-[var(--accent-safe)] flex items-center justify-center font-display text-xs font-semibold text-[#0a0e17]">
              {initials}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
