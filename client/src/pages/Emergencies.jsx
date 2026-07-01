import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";
//import EmergencyMap from "../components/EmergencyMap";

import { getEmergencies } from "../services/emergencyService";
import {
  FiSearch,
  FiAlertTriangle,
  FiDroplet,
  FiActivity,
  FiHeart,
  FiTruck,
  FiWind,
  FiSun,
  FiTriangle,
  FiX,
  FiUser,
  FiHome,
  FiClock,
  FiUsers,
} from "react-icons/fi";

const EMERGENCY_ICONS = {
  fire: FiAlertTriangle,
  flood: FiDroplet,
  earthquake: FiActivity,
  medical: FiHeart,
  accident: FiTruck,
  cyclone: FiWind,
  wildfire: FiSun,
  landslide: FiTriangle,
};

function Emergencies() {
  const { user } = useSelector((state) => state.auth);

  const [emergencies, setEmergencies] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [typeFilter, setTypeFilter] = useState("all");

  const [selectedEmergency, setSelectedEmergency] = useState(null);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const data = await getEmergencies(user.token);

        setEmergencies(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmergencies();
  }, [user]);

  const severityMap = {
    1: "Very Low",
    2: "Low",
    3: "Moderate",
    4: "High",
    5: "Critical",
  };
  const filteredEmergencies = useMemo(() => {
    return emergencies.filter((emergency) => {
      const matchesSearch =
        emergency.description.toLowerCase().includes(search.toLowerCase()) ||
        emergency.emergencyType.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || emergency.status === statusFilter;

      const matchesType =
        typeFilter === "all" || emergency.emergencyType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [emergencies, search, statusFilter, typeFilter]);

  const total = emergencies.length;

  const active = emergencies.filter((e) => e.status !== "completed").length;

  const completed = emergencies.filter((e) => e.status === "completed").length;

  const critical = emergencies.filter((e) => e.priorityScore >= 100).length;

  const priorityStyle = (priorityScore) => {
    if (priorityScore >= 100) return { label: "Critical", bg: "bg-[var(--accent-emergency-dim)]", text: "text-[var(--accent-emergency)]" };
    if (priorityScore >= 50) return { label: "High", bg: "bg-[var(--accent-warning-dim)]", text: "text-[var(--accent-warning)]" };
    if (priorityScore >= 20) return { label: "Medium", bg: "bg-[var(--accent-warning-dim)]", text: "text-[var(--accent-warning)]" };
    return { label: "Low", bg: "bg-[var(--accent-safe-dim)]", text: "text-[var(--accent-safe)]" };
  };

  const statusStyle = (status) => {
    switch (status) {
      case "pending":
        return { bg: "bg-[var(--accent-emergency-dim)]", text: "text-[var(--accent-emergency)]" };
      case "assigned":
        return { bg: "bg-[var(--accent-info-dim)]", text: "text-[var(--accent-info)]" };
      case "in_progress":
        return { bg: "bg-[var(--accent-warning-dim)]", text: "text-[var(--accent-warning)]" };
      case "completed":
        return { bg: "bg-[var(--accent-safe-dim)]", text: "text-[var(--accent-safe)]" };
      default:
        return { bg: "bg-[var(--bg-surface-raised)]", text: "text-[var(--text-muted)]" };
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display">Emergency Management</h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          Every incident reported across the network, filterable by status and type.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Total Emergencies</p>
          <h2 className="text-3xl font-bold font-display mt-2">{total}</h2>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Active</p>
          <h2 className="text-3xl font-bold font-display mt-2 text-[var(--accent-warning)]">{active}</h2>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Completed</p>
          <h2 className="text-3xl font-bold font-display mt-2 text-[var(--accent-safe)]">
            {completed}
          </h2>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <p className="text-[var(--text-muted)] text-sm">Critical</p>
          <h2 className="text-3xl font-bold font-display mt-2 text-[var(--accent-emergency)]">{critical}</h2>
        </div>
      </div>

      {/* <div className="bg-slate-900 rounded-lg overflow-hidden mb-8">
        <EmergencyMap
          emergencies={filteredEmergencies}
          routeCoordinates={[]}
        />
      </div> */}

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
          <input
            type="text"
            placeholder="Search emergencies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
        >
          <option value="all">All Status</option>

          <option value="pending">Pending</option>

          <option value="assigned">Assigned</option>

          <option value="in_progress">In Progress</option>

          <option value="completed">Completed</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
        >
          <option value="all">All Types</option>

          <option value="fire">Fire</option>

          <option value="flood">Flood</option>

          <option value="earthquake">Earthquake</option>

          <option value="medical">Medical</option>

          <option value="accident">Accident</option>

          <option value="cyclone">Cyclone</option>

          <option value="wildfire">Wildfire</option>

          <option value="landslide">Landslide</option>
        </select>
      </div>
      {filteredEmergencies.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-10 text-center">
          <FiAlertTriangle className="mx-auto text-[var(--text-muted)] mb-3" size={28} />
          <p className="font-medium">No emergencies found</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filteredEmergencies.map((emergency) => {
            const priority = priorityStyle(emergency.priorityScore);
            const status = statusStyle(emergency.status);
            const Icon = EMERGENCY_ICONS[emergency.emergencyType] || FiAlertTriangle;

            return (
              <div
                key={emergency._id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl p-5 transition-colors flex flex-col"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[var(--accent-emergency-dim)] flex items-center justify-center shrink-0">
                      <Icon className="text-[var(--accent-emergency)]" size={18} />
                    </span>
                    <h2 className="font-semibold capitalize">
                      {emergency.emergencyType}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${priority.bg} ${priority.text}`}
                  >
                    {priority.label}
                  </span>
                </div>

                <div className="mt-3 flex gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                  >
                    {emergency.status.replace("_", " ").toUpperCase()}
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-surface-raised)] text-[var(--text-secondary)]">
                    {severityMap[emergency.severity]}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-2 text-sm flex-1">
                  <p className="text-[var(--text-secondary)] line-clamp-2">{emergency.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-muted)] mt-2">
                    <span className="capitalize">
                      📍 {emergency.locationNode?.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers size={11} /> {emergency.affectedPeople} affected
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mt-2 font-mono-data">
                    <span>
                      {emergency.assignedResponder
                        ? `Responder: ${emergency.assignedResponder.name}`
                        : "No responder assigned"}
                    </span>
                    <span>{new Date(emergency.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEmergency(emergency)}
                  className="mt-4 w-full text-center text-sm font-medium text-[var(--accent-info)] hover:bg-[var(--accent-info-dim)] py-2 rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
      {selectedEmergency && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold font-display">
                Emergency Details
              </h2>

              <button
                onClick={() => setSelectedEmergency(null)}
                className="text-[var(--text-muted)] hover:text-white transition-colors p-1"
                aria-label="Close details"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[var(--text-muted)]">Type</span>
                <p className="capitalize font-medium">{selectedEmergency.emergencyType}</p>
              </div>

              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[var(--text-muted)]">Description</span>
                <p className="mt-1">{selectedEmergency.description}</p>
              </div>

              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[var(--text-muted)]">Location</span>
                <p className="capitalize font-medium">
                  {selectedEmergency.locationNode?.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </p>
              </div>

              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[var(--text-muted)]">Severity</span>
                <p className="font-medium">{severityMap[selectedEmergency.severity]}</p>
              </div>

              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[var(--text-muted)]">Priority Score</span>
                <p className="font-mono-data font-medium">{selectedEmergency.priorityScore}</p>
              </div>

              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5"><FiUsers size={13} /> People Affected</span>
                <p className="font-medium">{selectedEmergency.affectedPeople}</p>
              </div>

              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5"><FiClock size={13} /> Status</span>
                <p className="capitalize font-medium">{selectedEmergency.status}</p>
              </div>

              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5"><FiUser size={13} /> Assigned Responder</span>
                <p className="font-medium">
                  {selectedEmergency.assignedResponder
                    ? selectedEmergency.assignedResponder.name
                    : "Not Assigned"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5"><FiHome size={13} /> Assigned Shelter</span>
                <p className="font-medium">
                  {selectedEmergency.assignedShelter
                    ? selectedEmergency.assignedShelter.name
                    : "Not Assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Emergencies;
