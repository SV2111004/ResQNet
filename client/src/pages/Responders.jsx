import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";
import { getResponders } from "../services/userService";
import {
  FiUsers,
  FiSearch,
  FiMail,
  FiMapPin,
  FiNavigation,
} from "react-icons/fi";

function Responders() {
  const { user } = useSelector((state) => state.auth);

  const [responders, setResponders] = useState([]);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");

  useEffect(() => {
    const fetchResponders = async () => {
      try {
        const data = await getResponders(user.token);
        setResponders(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchResponders();
  }, [user]);

  const filteredResponders = responders.filter((responder) => {
    const matchesSearch =
      responder.name.toLowerCase().includes(search.toLowerCase()) ||
      responder.email.toLowerCase().includes(search.toLowerCase());

    const matchesAvailability =
      availability === "all"
        ? true
        : availability === "available"
          ? responder.isAvailable
          : !responder.isAvailable;

    return matchesSearch && matchesAvailability;
  });

  const total = responders.length;
  const available = responders.filter((r) => r.isAvailable).length;
  const busy = responders.filter((r) => !r.isAvailable).length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display">Responders</h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          Field responder roster, availability, and active missions.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Total Responders</p>
          <h2 className="text-3xl font-bold font-display mt-2">{total}</h2>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Available</p>
          <h2 className="text-3xl font-bold font-display mt-2 text-[var(--accent-safe)]">
            {available}
          </h2>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Busy</p>
          <h2 className="text-3xl font-bold font-display mt-2 text-[var(--accent-emergency)]">{busy}</h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
          <input
            type="text"
            placeholder="Search responder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
          />
        </div>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
        </select>
      </div>

      {filteredResponders.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-10 text-center">
          <FiUsers className="mx-auto text-[var(--text-muted)] mb-3" size={28} />
          <p className="font-medium">No responders found</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Try a different search or filter.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filteredResponders.map((responder) => (
            <div
              key={responder._id}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl p-5 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-info)] to-[var(--accent-safe)] flex items-center justify-center font-display text-sm font-semibold text-[#0a0e17] shrink-0">
                    {responder.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <h2 className="font-semibold truncate">{responder.name}</h2>
                </div>

                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                    responder.isAvailable
                      ? "bg-[var(--accent-safe-dim)] text-[var(--accent-safe)]"
                      : "bg-[var(--accent-emergency-dim)] text-[var(--accent-emergency)]"
                  }`}
                >
                  {responder.isAvailable ? "Available" : "Busy"}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-2.5 text-sm">
                <p className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <FiMail size={13} className="text-[var(--text-muted)] shrink-0" />
                  <span className="truncate">{responder.email}</span>
                </p>

                <p className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <FiMapPin size={13} className="text-[var(--text-muted)] shrink-0" />
                  {responder.locationNode || "Location unknown"}
                </p>

                <div className="flex items-start gap-2">
                  <FiNavigation size={13} className="text-[var(--text-muted)] shrink-0 mt-0.5" />
                  <div>
                    {responder.currentMission ? (
                      <span className="capitalize font-medium">
                        {responder.currentMission}
                      </span>
                    ) : (
                      <span className="text-[var(--text-muted)]">No active mission</span>
                    )}

                    {responder.missionStatus && (
                      <p className="text-xs text-[var(--accent-warning)] capitalize mt-0.5">
                        Status: {responder.missionStatus}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Responders;
