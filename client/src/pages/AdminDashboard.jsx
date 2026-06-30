import { useEffect } from "react";
import { useState } from "react";

import { useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";

import StatCard from "../components/StatCard";

import EmergencyMap from "../components/EmergencyMap";

//import { getResponders } from "../services/userService";
import { createMission } from "../services/missionService";
import {
  getEmergencies,
  getEmergencyStats,
} from "../services/emergencyService";

import socket from "../socket";

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
      alert("Mission Assigned");
    } catch (error) {
      console.log(error);
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

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        ResQNet Emergency Operations Center
      </h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Active Emergencies" value={stats.active} />

        <StatCard title="Pending" value={stats.pending} />

        <StatCard title="In Progress" value={stats.inProgress} />

        <StatCard title="Completed" value={stats.completed} />
      </div>

      <div
        className="
  bg-slate-900
  rounded-lg
  mt-8
  overflow-hidden"
      >
        <EmergencyMap
          emergencies={emergencies}
          routeCoordinates={routeCoordinates}
          // selectedEmergency={selectedEmergency}
          // selectedShelter={selectedShelter}
        />
      </div>
      <div className="mt-8">
        <h2
          className="
 text-xl
 font-bold
 mb-4"
        >
          Recent Emergencies
        </h2>

        {emergencies.map((emergency) => (
          <div
            key={emergency._id}
            className="
      bg-slate-900
      p-4
      rounded-lg
      mb-3"
          >
            <p>
              Type:
              {emergency.emergencyType}
            </p>

            <p>
              Priority:
              {emergency.priorityScore}
            </p>

            <p>
              Status:
              {emergency.status}
            </p>
            <p>
              Severity:
              {emergency.severity}
            </p>

            <p>
              Estimated People Affected:
              {emergency.affectedPeople}
            </p>
            {emergency.assignedResponder ? (
              <div className="mt-4 p-4 bg-slate-800 rounded">
                <h3 className="font-bold text-green-400">
                  👨‍🚒 Responder Assigned
                </h3>

                <p className="mt-2">
                  <span className="font-semibold">Name :</span>{" "}
                  {emergency.assignedResponder.name}
                </p>

                <p>
                  <span className="font-semibold">Mission :</span>

                  <span
                    className={
                      emergency.status === "completed"
                        ? "text-green-400 ml-2"
                        : emergency.status === "in_progress"
                          ? "text-yellow-400 ml-2"
                          : "text-orange-400 ml-2"
                    }
                  >
                    {emergency.status === "completed"
                      ? "Completed"
                      : emergency.status === "in_progress"
                        ? "In Progress"
                        : "Assigned"}
                  </span>
                </p>
              </div>
            ) : (
              <button
                onClick={() => assignMission(emergency._id)}
                className="
      mt-3
      bg-green-600
      px-4
      py-2
      rounded"
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
                        className="
              mt-3
              ml-3
              bg-blue-600
              px-4
              py-2
              rounded"
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
                            className="
    mt-4
    bg-green-600
    px-4
    py-2
    rounded"
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
        ))}
      </div>
      <div className="bg-slate-900 p-6 rounded-lg mt-8">
        <h2 className="text-xl font-bold mb-5">📋 Recent Activity</h2>

        <div className="space-y-4">
          {emergencies.slice(0, 5).map((emergency) => (
            <div
              key={emergency._id}
              className="flex justify-between items-start border-b border-slate-700 pb-4"
            >
              <div>
                <p className="font-semibold">
                  {emergency.status === "pending" &&
                    "🚨 New emergency reported"}

                  {emergency.status === "assigned" && "👨‍🚒 Responder assigned"}

                  {emergency.status === "in_progress" &&
                    "🧭 Rescue mission in progress"}

                  {emergency.status === "completed" && "✅ Mission completed"}
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  <span className="capitalize">{emergency.emergencyType}</span>

                  {" • "}

                  {emergency.locationNode}
                </p>

                {emergency.assignedResponder && (
                  <p className="text-sm text-blue-400 mt-1">
                    {emergency.assignedResponder.name}
                  </p>
                )}
              </div>

              <span className="text-xs text-slate-500">
                {new Date(emergency.updatedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
