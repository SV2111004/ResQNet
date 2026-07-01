import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiUsers,
  FiNavigation,
  FiArrowRight,
  FiMapPin,
  FiClock,
  FiShield,
  FiZap,
} from "react-icons/fi";

const STATS = [
  { icon: FiClock, value: "<2 min", label: "Average dispatch time" },
  { icon: FiZap, value: "24/7", label: "Live monitoring" },
  { icon: FiMapPin, value: "100%", label: "GPS-located reports" },
  { icon: FiShield, value: "3", label: "Roles working in sync" },
];

const FEATURES = [
  {
    icon: FiAlertTriangle,
    title: "Emergency Reporting",
    desc: "Citizens report disasters and SOS requests in seconds, with GPS location shared automatically.",
    accent: "text-[var(--accent-emergency)]",
    bg: "bg-[var(--accent-emergency-dim)]",
  },
  {
    icon: FiUsers,
    title: "Rescue Coordination",
    desc: "Admins triage incoming reports, assign responders, and track every mission in real time.",
    accent: "text-[var(--accent-info)]",
    bg: "bg-[var(--accent-info-dim)]",
  },
  {
    icon: FiNavigation,
    title: "Smart Routing",
    desc: "Dijkstra-based route optimization and nearest-shelter recommendation get help there faster.",
    accent: "text-[var(--accent-safe)]",
    bg: "bg-[var(--accent-safe-dim)]",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-28 pb-24 px-6 flex flex-col items-center text-center">
        {/* Decorative grid lives on its own layer so its edge-fade mask only
            ever clips the grid pattern, never the heading/buttons above it. */}
        <div className="radar-grid absolute inset-0 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 text-xs text-[var(--text-secondary)] mb-8"
        >
          <span className="pulse-dot w-1.5 h-1.5 text-[var(--accent-safe)]" />
          Live coordination network
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-3xl"
        >
          Help finds you,{" "}
          <span className="text-[var(--accent-emergency)]">faster.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-[var(--text-secondary)] max-w-xl mb-10"
        >
          ResQNet is a real-time disaster response and emergency coordination
          platform connecting citizens, responders, and command centers the
          moment it matters most.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <a
            href="/login"
            className="group inline-flex items-center gap-2 bg-[var(--accent-emergency)] hover:bg-[#e63e40] px-6 py-3.5 rounded-xl font-semibold transition-colors shadow-[0_0_0_1px_rgba(255,77,79,0.4),0_8px_30px_-8px_rgba(255,77,79,0.6)]"
          >
            Login
            <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="/register"
            className="border border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)] px-6 py-3.5 rounded-xl font-semibold transition-colors"
          >
            Create an account
          </a>
        </motion.div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 pb-28 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, accent, bg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 rounded-2xl text-left hover:border-[var(--border-strong)] transition-colors"
            >
              <span className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-4 ${bg}`}>
                <Icon className={accent} size={20} />
              </span>
              <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)] font-mono-data">
          <FiMapPin size={13} />
          Built for first responders, citizens, and command centers
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]/60">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="text-center"
            >
              <Icon className="mx-auto mb-2 text-[var(--accent-info)]" size={18} />
              <p className="font-display text-2xl md:text-3xl font-bold">{value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative py-24 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="radar-grid absolute inset-0 pointer-events-none" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center"
        >
          <span className="pulse-dot w-2 h-2 text-[var(--accent-emergency)] mb-5" />
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-lg">
            Every second counts. Be ready before it does.
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mb-8">
            Join ResQNet as a citizen, responder, or command center and get
            connected to the network the moment something goes wrong.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <a
              href="/register"
              className="group inline-flex items-center gap-2 bg-[var(--accent-emergency)] hover:bg-[#e63e40] px-6 py-3.5 rounded-xl font-semibold transition-colors shadow-[0_0_0_1px_rgba(255,77,79,0.4),0_8px_30px_-8px_rgba(255,77,79,0.6)]"
            >
              Get started
              <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="/login"
              className="border border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)] px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              I already have an account
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="pulse-dot w-2 h-2 text-[var(--accent-emergency)]" />
            <span className="font-display font-bold">ResQNet</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
            <a href="/login" className="hover:text-white transition-colors">Login</a>
            <a href="/register" className="hover:text-white transition-colors">Register</a>
          </div>

          <p className="text-xs text-[var(--text-muted)] font-mono-data">
            © {new Date().getFullYear()} ResQNet — Emergency Coordination Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
