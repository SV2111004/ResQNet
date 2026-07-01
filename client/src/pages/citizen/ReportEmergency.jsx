import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { createEmergency } from "../../services/emergencyService";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FiMapPin,
  FiRadio,
  FiAlertTriangle,
  FiCheckCircle,
  FiDroplet,
  FiWind,
  FiActivity,
  FiTriangle,
  FiHeart,
  FiTruck,
  FiSun,
} from "react-icons/fi";

const EMERGENCY_TYPES = [
  { value: "flood", label: "Flood", icon: FiDroplet },
  { value: "earthquake", label: "Earthquake", icon: FiActivity },
  { value: "landslide", label: "Landslide", icon: FiTriangle },
  { value: "cyclone", label: "Cyclone", icon: FiWind },
  { value: "wildfire", label: "Wildfire", icon: FiSun },
  { value: "medical", label: "Medical", icon: FiHeart },
  { value: "accident", label: "Accident", icon: FiTruck },
  { value: "fire", label: "Fire", icon: FiAlertTriangle },
];

const SEVERITY_LEVELS = [
  { value: 1, label: "Low" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "High" },
  { value: 4, label: "Critical" },
  { value: 5, label: "Extreme" },
];

function ReportEmergency() {
  const [emergencyType, setEmergencyType] = useState("flood");

  const [description, setDescription] = useState("");

  const [severity, setSeverity] = useState(1);

  const [affectedPeople, setAffectedPeople] = useState(1);

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  // NOTE: the original component referenced `user.token` without ever
  // selecting `user` from redux, which would throw at submit time.
  // Restoring that missing selector (same shape Navbar/Sidebar already use)
  // so the existing createEmergency call actually has a token to send.
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createEmergency(
        {
          emergencyType,
          description: description || "Emergency reported",

          lat,
          lng,

          severity,
          affectedPeople,
        },

        user.token,
      );

      toast.success("Emergency SOS sent — responders have been notified");
      setJustSubmitted(true);
      setTimeout(() => setJustSubmitted(false), 4000);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Couldn't send SOS — please try again"
      );
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  const severityMeta = SEVERITY_LEVELS.find((s) => s.value === severity);
  const severityColor =
    severity >= 4 ? "var(--accent-emergency)" : severity === 3 ? "var(--accent-warning)" : "var(--accent-safe)";

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-display flex items-center gap-3">
          <span className="pulse-dot w-3 h-3 text-[var(--accent-emergency)]" />
          Emergency SOS
        </h1>

        <p className="text-[var(--text-muted)] mt-2">
          Stay calm. Report your emergency and our responders will be notified
          immediately.
        </p>
      </div>

      <div className="bg-[var(--bg-surface)] rounded-2xl p-6 sm:p-8 shadow-xl border border-[var(--border-subtle)] max-w-2xl">
        <div
          className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
            lat
              ? "bg-[var(--accent-safe-dim)] border-[var(--accent-safe)]/30"
              : "bg-[var(--accent-warning-dim)] border-[var(--accent-warning)]/30"
          }`}
        >
          {lat ? (
            <FiMapPin className="text-[var(--accent-safe)] mt-0.5 shrink-0" size={18} />
          ) : (
            <FiRadio className="text-[var(--accent-warning)] mt-0.5 shrink-0 animate-pulse" size={18} />
          )}
          <div>
            <p className={lat ? "text-[var(--accent-safe)] text-sm font-medium" : "text-[var(--accent-warning)] text-sm font-medium"}>
              {lat
                ? "Location captured successfully"
                : "Fetching your location…"}
            </p>

            {lat && (
              <p className="text-xs text-[var(--text-muted)] mt-1 font-mono-data">
                {lat.toFixed(5)}, {lng.toFixed(5)} — shared only for this emergency
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Emergency type</label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EMERGENCY_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEmergencyType(value)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors ${
                    emergencyType === value
                      ? "bg-[var(--accent-emergency-dim)] border-[var(--accent-emergency)] text-[var(--accent-emergency)]"
                      : "bg-[var(--bg-surface-raised)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Description <span className="text-[var(--text-muted)] font-normal">(optional)</span>
            </label>

            <textarea
              rows="3"
              placeholder="Describe anything that can help responders…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[var(--bg-surface-raised)] p-3 rounded-lg border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Severity</label>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: severityColor, background: `color-mix(in srgb, ${severityColor} 15%, transparent)` }}
                >
                  {severity} • {severityMeta?.label}
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] px-0.5">
                <span>Low</span>
                <span>Extreme</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">People affected</label>

              <input
                type="number"
                min="1"
                value={affectedPeople}
                onChange={(e) => setAffectedPeople(Number(e.target.value))}
                className="bg-[var(--bg-surface-raised)] p-3 rounded-lg border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-[var(--accent-emergency)] to-[#d63a3c] hover:brightness-110 disabled:opacity-60 font-bold text-lg transition-all duration-200 shadow-[0_8px_30px_-8px_rgba(255,77,79,0.6)] flex items-center justify-center gap-2"
          >
            {justSubmitted ? (
              <>
                <FiCheckCircle size={20} />
                SOS Sent
              </>
            ) : submitting ? (
              "Sending…"
            ) : (
              <>
                <FiAlertTriangle size={20} />
                SEND EMERGENCY SOS
              </>
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default ReportEmergency;
