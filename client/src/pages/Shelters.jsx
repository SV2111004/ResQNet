import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getShelters } from "../services/shelterService";
import {
  FiHome,
  FiUsers,
  FiSearch,
  FiDroplet,
  FiCoffee,
} from "react-icons/fi";

function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const data = await getShelters();

        setShelters(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchShelters();
  }, []);
  const filteredShelters = shelters.filter((shelter) =>
    shelter.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalShelters = shelters.length;

  const totalCapacity = shelters.reduce(
    (sum, shelter) => sum + shelter.capacity,
    0,
  );

  const occupiedBeds = shelters.reduce(
    (sum, shelter) => sum + shelter.currentOccupancy,
    0,
  );

  const availableBeds = totalCapacity - occupiedBeds;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display">Shelter Management</h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          Live capacity and resource status across every registered shelter.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Total Shelters</p>
          <h2 className="text-3xl font-bold font-display mt-2">{totalShelters}</h2>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Total Capacity</p>
          <h2 className="text-3xl font-bold font-display mt-2">{totalCapacity}</h2>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Occupied Beds</p>
          <h2 className="text-3xl font-bold font-display mt-2 text-[var(--accent-emergency)]">
            {occupiedBeds}
          </h2>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Available Beds</p>
          <h2 className="text-3xl font-bold font-display mt-2 text-[var(--accent-safe)]">
            {availableBeds}
          </h2>
        </div>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
        <input
          type="text"
          placeholder="Search shelter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
        />
      </div>

      {filteredShelters.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-10 text-center">
          <FiHome className="mx-auto text-[var(--text-muted)] mb-3" size={28} />
          <p className="font-medium">No shelters found</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredShelters.map((shelter) => {
            const occupancyRatio = shelter.currentOccupancy / shelter.capacity;
            const occupancyPct = Math.round(occupancyRatio * 100);
            const barColor =
              occupancyRatio > 0.8
                ? "bg-[var(--accent-emergency)]"
                : occupancyRatio > 0.5
                  ? "bg-[var(--accent-warning)]"
                  : "bg-[var(--accent-safe)]";

            return (
              <div
                key={shelter._id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl p-5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[var(--accent-info-dim)] flex items-center justify-center shrink-0">
                      <FiHome className="text-[var(--accent-info)]" size={18} />
                    </span>
                    <div>
                      <h2 className="font-semibold">{shelter.name}</h2>
                      <p className="text-xs text-[var(--text-muted)] capitalize mt-0.5">{shelter.status}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] font-mono-data shrink-0">
                    <FiUsers size={12} />
                    {shelter.currentOccupancy}/{shelter.capacity}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
                    <span>Occupancy</span>
                    <span className="font-mono-data">{occupancyPct}%</span>
                  </div>
                  <div className="w-full bg-[var(--bg-surface-raised)] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${barColor}`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border-subtle)] text-xs">
                  <span className={`flex items-center gap-1.5 ${shelter.foodAvailable ? "text-[var(--accent-safe)]" : "text-[var(--text-muted)]"}`}>
                    <FiCoffee size={13} />
                    Food {shelter.foodAvailable ? "available" : "unavailable"}
                  </span>
                  <span className={`flex items-center gap-1.5 ${shelter.waterAvailable ? "text-[var(--accent-safe)]" : "text-[var(--text-muted)]"}`}>
                    <FiDroplet size={13} />
                    Water {shelter.waterAvailable ? "available" : "unavailable"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Shelters;
