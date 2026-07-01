import { useState } from "react";
import {
  FiDroplet,
  FiActivity,
  FiWind,
  FiSun,
  FiChevronDown,
  FiPhoneCall,
} from "react-icons/fi";

import DashboardLayout from "../../layouts/DashboardLayout";

const GUIDES = [
  {
    id: "flood",
    icon: FiDroplet,
    title: "Floods",
    accent: "text-[var(--accent-info)]",
    bg: "bg-[var(--accent-info-dim)]",
    tips: [
      "Move to higher ground immediately — don't wait for instructions.",
      "Avoid walking or driving through moving water; 6 inches can knock you down.",
      "Disconnect electrical appliances if it's safe to do so.",
      "Keep important documents in a waterproof bag.",
    ],
  },
  {
    id: "earthquake",
    icon: FiActivity,
    title: "Earthquakes",
    accent: "text-[var(--accent-warning)]",
    bg: "bg-[var(--accent-warning-dim)]",
    tips: [
      "Drop, cover, and hold on under sturdy furniture.",
      "Stay away from windows, mirrors, and tall furniture.",
      "If outdoors, move to an open area away from buildings and power lines.",
      "After shaking stops, check for injuries and gas leaks before moving.",
    ],
  },
  {
    id: "cyclone",
    icon: FiWind,
    title: "Cyclones",
    accent: "text-[var(--accent-safe)]",
    bg: "bg-[var(--accent-safe-dim)]",
    tips: [
      "Secure loose outdoor items that could become projectiles.",
      "Stock drinking water, food, flashlights, and a charged power bank.",
      "Stay indoors, away from windows, during the storm.",
      "Avoid coastal areas and low-lying regions prone to storm surge.",
    ],
  },
  {
    id: "wildfire",
    icon: FiSun,
    title: "Wildfires",
    accent: "text-[var(--accent-emergency)]",
    bg: "bg-[var(--accent-emergency-dim)]",
    tips: [
      "Evacuate early — don't wait for an official order if you feel unsafe.",
      "Close all windows and doors to slow the spread of smoke and embers.",
      "Wear an N95 mask if you must be outdoors in smoke.",
      "Keep a go-bag ready with essentials near the door.",
    ],
  },
];

const HOTLINES = [
  { label: "Police", value: "100" },
  { label: "Ambulance", value: "102" },
  { label: "Fire", value: "101" },
  { label: "Disaster Management", value: "108" },
];

function SafetyResources() {
  const [openId, setOpenId] = useState("flood");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Safety Resources</h1>
        <p className="text-[var(--text-muted)] mt-2 text-sm">
          Quick preparedness guides — what to do before, during, and right
          after common emergencies.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {GUIDES.map(({ id, icon: Icon, title, accent, bg, tips }) => {
            const open = openId === id;
            return (
              <div
                key={id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(open ? null : id)}
                  className="w-full flex items-center gap-3 p-5 text-left"
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon className={accent} size={18} />
                  </span>
                  <span className="font-semibold flex-1">{title}</span>
                  <FiChevronDown
                    className={`text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <ul className="px-5 pb-5 -mt-1 space-y-2.5">
                    {tips.map((tip, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-[var(--text-secondary)]">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${bg.replace("dim", "dim")}`} style={{ background: "currentColor" }} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <FiPhoneCall className="text-[var(--accent-emergency)]" size={18} />
            <h3 className="font-semibold">Emergency hotlines</h3>
          </div>
          <ul className="space-y-3">
            {HOTLINES.map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between border-b border-[var(--border-subtle)] last:border-0 pb-3 last:pb-0">
                <span className="text-sm text-[var(--text-secondary)]">{label}</span>
                <span className="font-mono-data font-semibold text-white">{value}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[var(--text-muted)] mt-4 leading-relaxed">
            For life-threatening emergencies, call your local emergency number
            directly in addition to reporting through ResQNet.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SafetyResources;
