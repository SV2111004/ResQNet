import { useEffect, useMemo } from "react";
import { useState } from "react";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";

import StatCard from "../components/StatCard";

import EmergencyMap from "../components/EmergencyMap";

import {
  FiAlertTriangle,
  FiClock,
  FiActivity,
  FiCheckCircle,
  FiUserCheck,
} from "react-icons/fi";

//import { getResponders } from "../services/userService";
import { createMission } from "../services/missionService";
import {
  getEmergencies,
  getEmergencyStats,
} from "../services/emergencyService";

import socket from "../socket";

const STATUS_BADGE = {
  completed: { text: "text-[var(--accent-safe)]", bg: "bg-[var(--accent-safe-dim)]", label: "Completed" },
  in_progress: { text: "text-[var(--accent-warning)]", bg: "bg-[var(--accent-warning-dim)]", label: "In Progress" },
  assigned: { text: "text-[var(--accent-info)]", bg: "bg-[var(--accent-info-dim)]", label: "Assigned" },
  pending: { text: "text-[var(--accent-emergency)]", bg: "bg-[var(--accent-emergency-dim)]", label: "Pending" },
};

function AdminDashboard() {
  const [emergencies, setEmergencies] = useState([]);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmergencies(user.token);

        setEmergencies(data);

        //const responderData = await getResponders(user.token);
        const statsData = await getEmergencyStats(user.token);

        setStats(statsData);

        // setResponders(responderData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  //const [responders, setResponders] = useState([]);

  const assignMission = async (emergencyId) => {
    try {
      // if (responders.length === 0) {
      //   return;
      // }

      await createMission(
        {
          emergencyId,
        },
        user.token,
      );
      const updatedEmergencies = await getEmergencies(user.token);

      setEmergencies(updatedEmergencies);
      toast.success("Mission assigned");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Couldn't assign mission");
    }
  };

  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    socket.on("newEmergency", (newEmergency) => {
      setEmergencies((prev) => [newEmergency, ...prev]);

      setStats((prev) => ({
        ...prev,
        active: prev.active + 1,

        pending: prev.pending + 1,
      }));
    });

    return () => {
      socket.off("newEmergency");
    };
  }, []);

  // const [startNode, setStartNode] = useState("sector18");

  // const [endNode, setEndNode] = useState("parichowk");

  // const [routeResult, setRouteResult] = useState(null);

  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // const handleRouteOptimization = async () => {
  //   try {
  //     const result = await optimizeRoute(startNode, endNode);

  //     setRouteResult(result);

  //     const coordinates = result.path.map((locationName) => {
  //       const location = demoLocations.find((loc) => loc.name === locationName);

  //       return [location.lat, location.lng];
  //     });

  //     setRouteCoordinates(coordinates);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const [recommendedShelters, setRecommendedShelters] = useState({});

  // const [selectedEmergency, setSelectedEmergency] = useState(null);

  // const [selectedShelter, setSelectedShelter] = useState(null);

  // const [shelterRoute, setShelterRoute] = useState([]);

  const shelterRequiredEmergencies = [
    "flood",
    "earthquake",
    "landslide",
    "cyclone",
    "wildfire",
  ];

  // Display-only ordering: active emergencies stay sorted by priority (so
  // whoever's most urgent is addressed first, same as before), completed
  // ones sink to the bottom instead of staying mixed in. Doesn't touch
  // `emergencies` state or the backend's priorityScore calculation at all.
  const sortedEmergencies = useMemo(() => {
    return [...emergencies].sort((a, b) => {
      const aCompleted = a.status === "completed" ? 1 : 0;
      const bCompleted = b.status === "completed" ? 1 : 0;
      if (aCompleted !== bCompleted) return aCompleted - bCompleted;
      if (!aCompleted) {
        // Active: highest priority first — this is what decides who gets
        // addressed first when several emergencies land at once.
        return (b.priorityScore ?? 0) - (a.priorityScore ?? 0);
      }
      // Completed: most recently finished first.
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [emergencies]);

  const recentActivity = useMemo(() => {
    return [...emergencies]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  }, [emergencies]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display">
          ResQNet Emergency Operations Center
        </h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          Live, city-wide view of every incident and its response status.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Emergencies" value={stats.active} icon={FiActivity} accent="blue" />
        <StatCard title="Pending" value={stats.pending} icon={FiClock} accent="amber" />
        <StatCard title="In Progress" value={stats.inProgress} icon={FiAlertTriangle} accent="blue" />
        <StatCard title="Completed" value={stats.completed} icon={FiCheckCircle} accent="teal" />
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl mt-6 overflow-hidden">
        <EmergencyMap
          emergencies={emergencies}
          routeCoordinates={routeCoordinates}
          // selectedEmergency={selectedEmergency}
          // selectedShelter={selectedShelter}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold font-display mb-4">
          Recent Emergencies
        </h2>

        {sortedEmergencies.length === 0 && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 text-center text-[var(--text-muted)] text-sm">
            No emergencies reported yet.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {sortedEmergencies.map((emergency) => {
            const badge = STATUS_BADGE[emergency.status] || STATUS_BADGE.pending;
            return (
              <div
                key={emergency._id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl p-5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[var(--accent-emergency-dim)] flex items-center justify-center shrink-0">
                      <FiAlertTriangle className="text-[var(--accent-emergency)]" size={18} />
                    </span>
                    <h3 className="font-semibold capitalize">{emergency.emergencyType}</h3>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-[var(--text-secondary)]">
                  <span>Priority</span>
                  <span className="text-right font-mono-data text-white">{emergency.priorityScore}</span>

                  <span>Severity</span>
                  <span className="text-right font-mono-data text-white">{emergency.severity}/5</span>

                  <span>People affected</span>
                  <span className="text-right font-mono-data text-white">{emergency.affectedPeople}</span>
                </div>

                {emergency.assignedResponder ? (
                  <div className="mt-4 p-3 rounded-xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)]">
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-safe)]">
                      <FiUserCheck size={14} />
                      Responder Assigned
                    </h4>
                    <p className="mt-1.5 text-sm">
                      <span className="text-[var(--text-muted)]">Name:</span>{" "}
                      {emergency.assignedResponder.name}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => assignMission(emergency._id)}
                    className="mt-4 w-full bg-[var(--accent-safe)] hover:brightness-110 text-[#0a0e17] font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
                  >
                    Assign Nearest Responder
                  </button>
                )}
                {/* {emergency.status !== "completed" &&
                  shelterRequiredEmergencies.includes(emergency.emergencyType) && (
                    <>
                      {emergency.assignedShelter ? (
                        <div className="mt-3 ml-3 text-green-400 font-semibold">
                          ✅ Shelter Assigned
                          <br />
                          {emergency.assignedShelter.name}
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleShelterRecommendation(emergency)}
                            className="mt-3 ml-3 bg-blue-600 px-4 py-2 rounded"
                          >
                            Find Shelter
                          </button>

                          {recommendedShelters[emergency._id] && (
                            <div className="mt-4 bg-slate-800 p-4 rounded">
                              <h3 className="font-bold text-green-400">
                                Recommended Shelter
                              </h3>

                              <p>{recommendedShelters[emergency._id].name}</p>

                              <p>
                                Distance:{" "}
                                {recommendedShelters[emergency._id].distance} km
                              </p>

                              <p>
                                Available Beds:{" "}
                                {recommendedShelters[emergency._id].availableBeds}
                              </p>

                              <p>
                                Food:{" "}
                                {recommendedShelters[emergency._id].foodAvailable
                                  ? "Yes"
                                  : "No"}
                              </p>

                              <p>
                                Water:{" "}
                                {recommendedShelters[emergency._id].waterAvailable
                                  ? "Yes"
                                  : "No"}
                              </p>
                              <button
                                onClick={() => handleAssignShelter(emergency)}
                                className="mt-4 bg-green-600 px-4 py-2 rounded"
                              >
                                Assign Shelter
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )} */}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-bold font-display mb-5">Recent Activity</h2>

        {recentActivity.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No activity yet.</p>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((emergency) => (
              <div
                key={emergency._id}
                className="flex justify-between items-start gap-3 border-b border-[var(--border-subtle)] last:border-0 pb-4 last:pb-0"
              >
                <div>
                  <p className="font-medium text-sm">
                    {emergency.status === "pending" &&
                      "New emergency reported"}

                    {emergency.status === "assigned" && "Responder assigned"}

                    {emergency.status === "in_progress" &&
                      "Rescue mission in progress"}

                    {emergency.status === "completed" && "Mission completed"}
                  </p>

                  <p className="text-[var(--text-muted)] text-xs mt-1">
                    <span className="capitalize">{emergency.emergencyType}</span>

                    {" • "}

                    {emergency.locationNode}
                  </p>

                  {emergency.assignedResponder && (
                    <p className="text-xs text-[var(--accent-info)] mt-1">
                      {emergency.assignedResponder.name}
                    </p>
                  )}
                </div>

                <span className="text-xs text-[var(--text-muted)] font-mono-data shrink-0">
                  {new Date(emergency.updatedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
