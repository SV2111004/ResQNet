import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiShield,
  FiMessageSquare,
  FiArrowRight,
  FiPhoneCall,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";

const QUICK_ACTIONS = [
  {
    to: "/citizen/my-reports",
    title: "My Reports",
    desc: "Track the status of emergencies you've reported.",
    icon: FiFileText,
    accent: "text-[var(--accent-info)]",
    bg: "bg-[var(--accent-info-dim)]",
    border: "hover:border-[var(--accent-info)]/40",
  },
  {
    to: "/citizen/safety",
    title: "Safety Resources",
    desc: "Preparedness guides for floods, fires, quakes & more.",
    icon: FiShield,
    accent: "text-[var(--accent-safe)]",
    bg: "bg-[var(--accent-safe-dim)]",
    border: "hover:border-[var(--accent-safe)]/40",
  },
  {
    to: "/citizen/feedback",
    title: "Feedback",
    desc: "Tell us how ResQNet performed during your incident.",
    icon: FiMessageSquare,
    accent: "text-[var(--accent-warning)]",
    bg: "bg-[var(--accent-warning-dim)]",
    border: "hover:border-[var(--accent-warning)]/40",
  },
];

const SAFETY_TIP = {
  title: "Before help arrives",
  body: "If it's safe to do so, move to higher ground during floods, drop-cover-hold during earthquakes, and keep your phone charged so responders can reach you.",
};

function CitizenDashboard() {
  const { user } = useSelector((state) => state.auth);
  const firstName = user?.user?.name?.split(" ")[0] || "there";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <DashboardLayout>
      {/* Welcome / SOS banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 mb-6 animate-fade-in-up">
        <div className="absolute inset-0 radar-grid opacity-60 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[var(--text-muted)] text-sm mb-1">{greeting},</p>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">{firstName} 👋</h1>
            <p className="text-[var(--text-secondary)] mt-2 max-w-md text-sm">
              You're connected to ResQNet's live response network. If something
              is wrong, don't wait — report it now.
            </p>
          </div>

          <Link
            to="/citizen/report"
            className="group inline-flex items-center justify-center gap-2 bg-[var(--accent-emergency)] hover:bg-[#e63e40] text-white font-bold px-6 py-4 rounded-xl text-lg shrink-0 shadow-[0_0_0_1px_rgba(255,77,79,0.4),0_8px_30px_-8px_rgba(255,77,79,0.6)] transition-colors"
          >
            <span className="pulse-dot w-2 h-2 text-white" />
            SEND SOS
            <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {QUICK_ACTIONS.map(({ to, title, desc, icon: Icon, accent, bg, border }) => (
          <Link
            key={to}
            to={to}
            className={`group bg-[var(--bg-surface)] border border-[var(--border-subtle)] ${border} rounded-2xl p-5 flex items-start gap-4 transition-colors`}
          >
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
              <Icon className={accent} size={20} />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold flex items-center gap-1.5">
                {title}
                <FiArrowRight
                  size={14}
                  className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[var(--text-muted)]"
                />
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Safety tip + emergency contacts */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FiShield className="text-[var(--accent-safe)]" size={18} />
            <h3 className="font-semibold">{SAFETY_TIP.title}</h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {SAFETY_TIP.body}
          </p>
          <Link
            to="/citizen/safety"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--accent-info)] hover:underline mt-4 font-medium"
          >
            View all safety resources
            <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FiPhoneCall className="text-[var(--accent-warning)]" size={18} />
            <h3 className="font-semibold">Emergency contacts</h3>
          </div>
          <ul className="space-y-2 text-sm font-mono-data">
            <li className="flex justify-between text-[var(--text-secondary)]">
              <span>Police</span><span className="text-white">100</span>
            </li>
            <li className="flex justify-between text-[var(--text-secondary)]">
              <span>Ambulance</span><span className="text-white">102</span>
            </li>
            <li className="flex justify-between text-[var(--text-secondary)]">
              <span>Fire</span><span className="text-white">101</span>
            </li>
            <li className="flex justify-between text-[var(--text-secondary)]">
              <span>Disaster Mgmt.</span><span className="text-white">108</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CitizenDashboard;
