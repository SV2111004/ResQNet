import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";

import { getMyMissions } from "../services/missionService";

import { acceptMission } from "../services/missionService";

import { completeMission } from "../services/missionService";

import { recommendShelter } from "../services/shelterService";

import { assignShelter } from "../services/emergencyService";

import EmergencyMap from "../components/EmergencyMap";

import { optimizeRoute } from "../services/routeService";

import socket from "../socket";

function ResponderDashboard() {
  const [missions, setMissions] = useState([]);

  const [recommendedShelters, setRecommendedShelters] = useState({});

  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getMyMissions(user.token);

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

      alert("Mission Accepted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleComplete = async (missionId) => {
    try {
      await completeMission(missionId, user.token);

      alert("Mission Completed");

      window.location.reload();
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    socket.on("newMission", (mission) => {
      alert("New Mission Assigned!");
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
  return (
    <DashboardLayout>
      <h1
        className="
        text-3xl
        font-bold
        mb-6"
      >
        Responder Dashboard
      </h1>
      <div
        className="
    bg-slate-900
    rounded-lg
    overflow-hidden
    mb-8"
      >
        <EmergencyMap emergencies={emergencyLocations} routeCoordinates={[]} />
      </div>
      <h2
        className="
        font-semibold
        mb-4"
      >
        Assigned Missions
      </h2>

      {missions.length === 0 ? (
        <div
          className="
      bg-slate-900
      p-6
      rounded-lg"
        >
          No missions assigned.
        </div>
      ) : (
        missions.map((mission) => {
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

          if (priorityScore >= 100) {
            priorityLabel = "Critical";
            priorityColor = "text-red-500";
          } else if (priorityScore >= 50) {
            priorityLabel = "High";
            priorityColor = "text-orange-400";
          } else if (priorityScore >= 20) {
            priorityLabel = "Medium";
            priorityColor = "text-yellow-400";
          } else {
            priorityLabel = "Low";
            priorityColor = "text-green-400";
          }
          const emergencyIcons = {
            flood: "🌊",
            earthquake: "🌍",
            landslide: "⛰️",
            cyclone: "🌀",
            wildfire: "🔥",
            fire: "🔥",
            accident: "🚗",
            medical: "🚑",
          };
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

          return (
            <div
              key={mission._id}
              className="
          bg-slate-900
          p-5
          rounded-lg
          mb-4"
            >
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span>{emergencyIcons[mission.emergency?.emergencyType]}</span>

                <span className="capitalize">
                  {mission.emergency?.emergencyType}
                </span>
              </h3>

              <p className="mt-2">
                Priority :
                <span className={`font-bold ml-2 ${priorityColor}`}>
                  {priorityLabel}
                </span>
              </p>

              <p>Status: {mission.status}</p>

              <p>
                Description:
                {mission.emergency?.description}
              </p>

              <p>
                Severity :
                <span className="font-semibold ml-2">
                  {severityMap[mission.emergency?.severity]}
                </span>
              </p>

              <p>
                Estimated People Affected :
                <span className="font-semibold ml-2">
                  {mission.emergency?.affectedPeople}
                </span>
              </p>

              {mission.status === "assigned" && (
                <button
                  onClick={() => handleAccept(mission._id)}
                  className="
              mt-4
              bg-green-600
              px-4
              py-2
              rounded"
                >
                  Accept Mission
                </button>
              )}

              {mission.status === "accepted" && (
                <>
                  {shelterRequired && (
                    <div
                      className="
                  mt-4
                  p-3
                  bg-slate-800
                  rounded"
                    >
                      <p className="text-yellow-400 font-semibold">
                        Shelter Required
                      </p>

                      <button
                        onClick={() => handleShelterRecommendation(mission)}
                        className="
    mt-3
    bg-blue-600
    px-4
    py-2
    rounded"
                      >
                        Find Nearby Shelter
                      </button>
                      {recommendedShelters[mission._id] && (
                        <div
                          className="
      mt-4
      bg-slate-700
      p-4
      rounded"
                        >
                          <h3 className="font-bold text-green-400">
                            Recommended Shelter
                          </h3>

                          <p>{recommendedShelters[mission._id].name}</p>

                          <p>
                            Distance:{" "}
                            {recommendedShelters[mission._id].distance} km
                          </p>

                          <p>
                            Available Beds:{" "}
                            {recommendedShelters[mission._id].availableBeds}
                          </p>

                          <p>
                            Food:{" "}
                            {recommendedShelters[mission._id].foodAvailable
                              ? "Yes"
                              : "No"}
                          </p>

                          <p>
                            Water:{" "}
                            {recommendedShelters[mission._id].waterAvailable
                              ? "Yes"
                              : "No"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleComplete(mission._id)}
                    className="
                mt-4
                bg-blue-600
                px-4
                py-2
                rounded"
                  >
                    Complete Mission
                  </button>
                </>
              )}

              {mission.status === "completed" && (
                <div
                  className="
              mt-4
              text-green-400
              font-semibold"
                >
                  Mission Completed
                </div>
              )}
            </div>
          );
        })
      )}
    </DashboardLayout>
  );
}

export default ResponderDashboard;
