import { useEffect, useMemo, useState } from "react";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";

import { getMyMissions } from "../services/missionService";

import { acceptMission } from "../services/missionService";

import { completeMission } from "../services/missionService";

import { recommendShelter } from "../services/shelterService";

import { assignShelter } from "../services/emergencyService";

import EmergencyMap from "../components/EmergencyMap";

import { optimizeRoute } from "../services/routeService";

import socket from "../socket";

import { startNavigation, reachSite } from "../services/missionService";

import {
  FiNavigation,
  FiAlertTriangle,
  FiDroplet,
  FiActivity,
  FiHeart,
  FiTruck,
  FiWind,
  FiSun,
  FiTriangle,
  FiMapPin,
  FiCheckCircle,
  FiHome,
  FiUsers,
  FiCompass,
} from "react-icons/fi";

const EMERGENCY_ICONS = {
  flood: FiDroplet,
  earthquake: FiActivity,
  landslide: FiTriangle,
  cyclone: FiWind,
  wildfire: FiSun,
  fire: FiAlertTriangle,
  accident: FiTruck,
  medical: FiHeart,
};

function ResponderDashboard() {
  const [missions, setMissions] = useState([]);

  const [recommendedShelters, setRecommendedShelters] = useState({});

  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getMyMissions(user.token);
        console.log(data);
        setMissions(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMissions();
  }, [user]);

  const handleAccept = async (missionId) => {
    try {
      await acceptMission(missionId, user.token);

      const updated = await getMyMissions(user.token);

      setMissions(updated);

      toast.success("Mission accepted");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Couldn't accept mission");
    }
  };

  const handleComplete = async (missionId) => {
    try {
      await completeMission(missionId, user.token);

      toast.success("Mission completed");

      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Couldn't complete mission");
    }
  };

  const handleShelterRecommendation = async (mission) => {
    try {
      const shelter = await recommendShelter(
        mission.emergency.location.lat,
        mission.emergency.location.lng,
      );

      setRecommendedShelters((prev) => ({
        ...prev,
        [mission._id]: shelter,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAssignShelter = async (mission) => {
    try {
      const shelter = recommendedShelters[mission._id];
      console.log("Emergency:", mission.emergency._id);
      console.log("Shelter:", shelter);
      console.log("Shelter ID:", shelter._id);

      await assignShelter(mission.emergency._id, shelter._id, user.token);

      toast.success("Shelter assigned successfully");

      const updated = await getMyMissions(user.token);

      setMissions(updated);
      setRecommendedShelters((prev) => ({
        ...prev,
        [mission._id]: null,
      }));
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleNavigate = async (mission) => {
    try {
      const data = await optimizeRoute(
        mission.responder.locationNode,
        mission.emergency.locationNode,
      );

      setRouteCoordinates(data.routeCoordinates);

      await startNavigation(
        mission._id,
        {
          distance: data.distance,
          eta: data.eta,
          path: data.path,
        },
        user.token,
      );

      const updated = await getMyMissions(user.token);

      setMissions(updated);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("newMission", (mission) => {
      toast.success("New mission assigned!");
      setMissions((prev) => [mission, ...prev]);
    });

    return () => {
      socket.off("newMission");
    };
  }, []);
  const emergencyLocations = missions
    .filter(
      (mission) =>
        mission.emergency?.location?.lat && mission.emergency?.location?.lng,
    )
    .map((mission) => ({
      _id: mission.emergency._id,
      emergencyType: mission.emergency.emergencyType,
      priorityScore: mission.emergency.priorityScore,
      status: mission.status,
      location: mission.emergency.location,
    }));

  // Display-only ordering: active missions stay sorted by the emergency's
  // priority (so the most urgent mission is addressed first, same priority
  // logic as before), completed missions sink to the bottom instead of
  // staying mixed in. Doesn't touch `missions` state or any handler logic.
  const sortedMissions = useMemo(() => {
    return [...missions].sort((a, b) => {
      const aCompleted = a.status === "completed" ? 1 : 0;
      const bCompleted = b.status === "completed" ? 1 : 0;
      if (aCompleted !== bCompleted) return aCompleted - bCompleted;
      if (!aCompleted) {
        return (b.emergency?.priorityScore ?? 0) - (a.emergency?.priorityScore ?? 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [missions]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display">Responder Dashboard</h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          Your assigned missions, live on the map and ready to action.
        </p>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden mb-8">
        <EmergencyMap
          emergencies={emergencyLocations}
          routeCoordinates={routeCoordinates}
        />
      </div>

      <h2 className="text-xl font-bold font-display mb-4">Assigned Missions</h2>

      {sortedMissions.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-10 text-center">
          <FiCompass className="mx-auto text-[var(--text-muted)] mb-3" size={28} />
          <p className="font-medium">No missions assigned</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            New missions will appear here as soon as they're assigned to you.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMissions.map((mission) => {
            const priorityScore = mission.emergency?.priorityScore;

            let priorityLabel = "";
            const severityMap = {
              1: "Very Low",
              2: "Low",
              3: "Moderate",
              4: "High",
              5: "Critical",
            };
            let priorityColor = "";
            let priorityBg = "";

            if (priorityScore >= 100) {
              priorityLabel = "Critical";
              priorityColor = "text-[var(--accent-emergency)]";
              priorityBg = "bg-[var(--accent-emergency-dim)]";
            } else if (priorityScore >= 50) {
              priorityLabel = "High";
              priorityColor = "text-[var(--accent-warning)]";
              priorityBg = "bg-[var(--accent-warning-dim)]";
            } else if (priorityScore >= 20) {
              priorityLabel = "Medium";
              priorityColor = "text-[var(--accent-warning)]";
              priorityBg = "bg-[var(--accent-warning-dim)]";
            } else {
              priorityLabel = "Low";
              priorityColor = "text-[var(--accent-safe)]";
              priorityBg = "bg-[var(--accent-safe-dim)]";
            }

            const EmergencyIcon = EMERGENCY_ICONS[mission.emergency?.emergencyType] || FiAlertTriangle;

            const shelterRequiredEmergencies = [
              "flood",
              "earthquake",
              "landslide",
              "cyclone",
              "wildfire",
            ];

            const shelterRequired =
              shelterRequiredEmergencies.includes(
                mission.emergency?.emergencyType,
              ) &&
              (mission.emergency?.severity >= 3 ||
                mission.emergency?.affectedPeople >= 10);

            const statusBadge =
              mission.status === "accepted"
                ? { bg: "bg-[var(--accent-safe-dim)]", text: "text-[var(--accent-safe)]" }
                : mission.status === "assigned"
                  ? { bg: "bg-[var(--accent-info-dim)]", text: "text-[var(--accent-info)]" }
                  : { bg: "bg-[var(--bg-surface-raised)]", text: "text-[var(--text-muted)]" };

            return (
              <div
                key={mission._id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${priorityBg}`}>
                      <EmergencyIcon className={priorityColor} size={20} />
                    </span>
                    <h3 className="text-xl font-bold font-display capitalize">
                      {mission.emergency?.emergencyType}
                    </h3>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityBg} ${priorityColor}`}>
                      {priorityLabel} Priority
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                      {mission.status.toUpperCase()}
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-surface-raised)] text-[var(--text-secondary)]">
                      {severityMap[mission.emergency?.severity]} Severity
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                  <div className="flex gap-2">
                    <span className="text-[var(--text-muted)] shrink-0">Description</span>
                    <span className="text-[var(--text-secondary)]">{mission.emergency?.description}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-[var(--text-muted)] shrink-0" size={13} />
                    <span className="capitalize text-[var(--text-secondary)]">
                      {mission.emergency?.locationNode?.replace(
                        /([a-z])([A-Z])/g,
                        "$1 $2",
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiAlertTriangle className="text-[var(--text-muted)] shrink-0" size={13} />
                    <span className="text-[var(--text-secondary)]">{severityMap[mission.emergency?.severity]}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiUsers className="text-[var(--text-muted)] shrink-0" size={13} />
                    <span className="text-[var(--text-secondary)]">{mission.emergency?.affectedPeople} people affected</span>
                  </div>
                </div>

                {mission.status === "assigned" && (
                  <button
                    onClick={() => handleAccept(mission._id)}
                    className="mt-5 bg-[var(--accent-safe)] hover:brightness-110 text-[#0a0e17] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
                  >
                    Accept Mission
                  </button>
                )}

                {mission.status === "accepted" && (
                  <>
                    {!mission.navigationStarted && (
                      <button
                        onClick={() => handleNavigate(mission)}
                        className="mt-5 inline-flex items-center gap-2 bg-[var(--accent-info)] hover:brightness-110 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
                      >
                        <FiNavigation size={15} />
                        Navigate to Emergency
                      </button>
                    )}
                    {mission.navigationStarted && (
                      <div className="mt-5 bg-[var(--accent-info-dim)] border border-[var(--accent-info)]/30 rounded-xl p-4">
                        <h3 className="flex items-center gap-2 text-[var(--accent-info)] font-semibold text-sm">
                          <FiNavigation size={15} />
                          En route to emergency
                        </h3>

                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                          <p>
                            Distance:
                            <span className="font-semibold ml-1.5 font-mono-data">
                              {mission.routeDistance} km
                            </span>
                          </p>

                          <p>
                            ETA:
                            <span className="font-semibold ml-1.5 font-mono-data">
                              {mission.routeETA} min
                            </span>
                          </p>
                        </div>

                        <p className="mt-3 font-semibold text-[var(--accent-info)] text-sm">
                          Optimized Route
                        </p>

                        <p className="text-xs mt-1 text-[var(--text-secondary)] font-mono-data">
                          {mission.routePath.join(" → ")}
                        </p>

                        <p className="text-[var(--accent-safe)] mt-2 text-xs font-medium flex items-center gap-1.5">
                          <span className="pulse-dot w-1.5 h-1.5" />
                          Route active
                        </p>

                        {!mission.reachedSite && (
                          <button
                            onClick={async () => {
                              await reachSite(mission._id, user.token);

                              const updated = await getMyMissions(user.token);

                              setMissions(updated);
                            }}
                            className="mt-4 inline-flex items-center gap-2 bg-[var(--accent-safe)] hover:brightness-110 text-[#0a0e17] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
                          >
                            <FiMapPin size={15} />
                            Reached Emergency Site
                          </button>
                        )}
                      </div>
                    )}
                    {mission.reachedSite &&
                      shelterRequired &&
                      !mission.emergency?.assignedShelter && (
                        <div className="mt-5 p-4 rounded-xl bg-[var(--accent-warning-dim)] border border-[var(--accent-warning)]/30">
                          <p className="text-[var(--accent-warning)] font-semibold text-sm">
                            Shelter Required
                          </p>

                          <button
                            onClick={() => handleShelterRecommendation(mission)}
                            className="mt-3 inline-flex items-center gap-2 bg-[var(--accent-info)] hover:brightness-110 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all"
                          >
                            <FiHome size={14} />
                            Find Nearby Shelter
                          </button>

                          {recommendedShelters[mission._id] && (
                            <div className="mt-4 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] p-4 rounded-xl">
                              <h3 className="font-semibold text-[var(--accent-safe)] text-sm">
                                Recommended Shelter
                              </h3>

                              <p className="mt-2 font-medium">{recommendedShelters[mission._id].name}</p>

                              <div className="grid grid-cols-2 gap-1.5 mt-2 text-sm text-[var(--text-secondary)]">
                                <p>
                                  Distance: {recommendedShelters[mission._id].distance} km
                                </p>
                                <p>
                                  Beds: {recommendedShelters[mission._id].availableBeds}
                                </p>
                                <p>
                                  Food: {recommendedShelters[mission._id].foodAvailable ? "Yes" : "No"}
                                </p>
                                <p>
                                  Water: {recommendedShelters[mission._id].waterAvailable ? "Yes" : "No"}
                                </p>
                              </div>

                              <button
                                onClick={() => handleAssignShelter(mission)}
                                disabled={mission.emergency?.assignedShelter}
                                className="mt-4 bg-[var(--accent-safe)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0e17] font-semibold text-sm px-4 py-2 rounded-lg transition-all"
                              >
                                Assign Shelter
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    {mission.emergency?.assignedShelter && (
                      <div className="mt-5 p-4 rounded-xl bg-[var(--accent-safe-dim)] border border-[var(--accent-safe)]/30">
                        <h3 className="flex items-center gap-2 text-[var(--accent-safe)] font-semibold text-sm">
                          <FiHome size={15} />
                          Assigned Shelter
                        </h3>

                        <p className="mt-2 font-medium">
                          {mission.emergency.assignedShelter.name}
                        </p>

                        <div className="grid grid-cols-3 gap-1.5 mt-2 text-sm text-[var(--text-secondary)]">
                          <p>
                            Beds: {mission.emergency.assignedShelter.availableBeds}
                          </p>
                          <p>
                            Food: {mission.emergency.assignedShelter.foodAvailable ? "Yes" : "No"}
                          </p>
                          <p>
                            Water: {mission.emergency.assignedShelter.waterAvailable ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    )}

                    {mission.reachedSite &&
                      (!shelterRequired ||
                        mission.emergency?.assignedShelter) && (
                        <button
                          onClick={() => handleComplete(mission._id)}
                          className="mt-5 inline-flex items-center gap-2 bg-[var(--accent-info)] hover:brightness-110 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
                        >
                          <FiCheckCircle size={15} />
                          Complete Mission
                        </button>
                      )}
                  </>
                )}

                {mission.status === "completed" && (
                  <div className="mt-5 inline-flex items-center gap-2 text-[var(--accent-safe)] font-semibold text-sm">
                    <FiCheckCircle size={16} />
                    Mission Completed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default ResponderDashboard;
