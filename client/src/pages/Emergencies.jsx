import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";
//import EmergencyMap from "../components/EmergencyMap";

import { getEmergencies } from "../services/emergencyService";

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

  const emergencyIcons = {
    fire: "🔥",
    flood: "🌊",
    earthquake: "🌍",
    medical: "🚑",
    accident: "🚗",
    cyclone: "🌀",
    wildfire: "🔥",
    landslide: "⛰️",
  };

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

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Emergency Management</h1>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-5">
          <p className="text-gray-400">Total Emergencies</p>

          <h2 className="text-3xl font-bold mt-2">{total}</h2>
        </div>

        <div className="bg-slate-900 rounded-lg p-5">
          <p className="text-gray-400">Active</p>

          <h2 className="text-3xl font-bold text-yellow-400 mt-2">{active}</h2>
        </div>

        <div className="bg-slate-900 rounded-lg p-5">
          <p className="text-gray-400">Completed</p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {completed}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-lg p-5">
          <p className="text-gray-400">Critical</p>

          <h2 className="text-3xl font-bold text-red-400 mt-2">{critical}</h2>
        </div>
      </div>

      {/* <div className="bg-slate-900 rounded-lg overflow-hidden mb-8">
        <EmergencyMap
          emergencies={filteredEmergencies}
          routeCoordinates={[]}
        />
      </div> */}

      <div className="bg-slate-900 rounded-lg p-5 mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search Emergency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 rounded px-4 py-2 flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 rounded px-4 py-2"
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
          className="bg-slate-800 rounded px-4 py-2"
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
        <div className="bg-slate-900 rounded-lg p-8 text-center text-gray-400">
          No Emergencies Found
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {filteredEmergencies.map((emergency) => {
            let priority = "";
            let priorityColor = "";

            if (emergency.priorityScore >= 100) {
              priority = "Critical";
              priorityColor = "bg-red-600";
            } else if (emergency.priorityScore >= 50) {
              priority = "High";
              priorityColor = "bg-orange-500";
            } else if (emergency.priorityScore >= 20) {
              priority = "Medium";
              priorityColor = "bg-yellow-500 text-black";
            } else {
              priority = "Low";
              priorityColor = "bg-green-600";
            }

            let statusColor = "";

            switch (emergency.status) {
              case "pending":
                statusColor = "bg-red-600";
                break;

              case "assigned":
                statusColor = "bg-blue-600";
                break;

              case "in_progress":
                statusColor = "bg-yellow-500 text-black";
                break;

              case "completed":
                statusColor = "bg-green-600";
                break;

              default:
                statusColor = "bg-gray-600";
            }

            return (
              <div key={emergency._id} className="bg-slate-900 rounded-lg p-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex gap-2 items-center">
                    <span>{emergencyIcons[emergency.emergencyType]}</span>

                    <span className="capitalize">
                      {emergency.emergencyType}
                    </span>
                  </h2>

                  <span
                    className={`${priorityColor} px-3 py-1 rounded-full text-sm font-semibold`}
                  >
                    {priority}
                  </span>
                </div>

                <div className="mt-4 flex gap-3 flex-wrap">
                  <span
                    className={`${statusColor} px-3 py-1 rounded-full text-sm`}
                  >
                    {emergency.status.replace("_", " ").toUpperCase()}
                  </span>

                  <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                    {severityMap[emergency.severity]}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex">
                    <span className="w-44 text-gray-400">Description</span>

                    <span>{emergency.description}</span>
                  </div>

                  <div className="flex">
                    <span className="w-44 text-gray-400">Location</span>

                    <span className="capitalize">
                      {emergency.locationNode?.replace(
                        /([a-z])([A-Z])/g,
                        "$1 $2",
                      )}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-44 text-gray-400">People Affected</span>

                    <span>{emergency.affectedPeople}</span>
                  </div>

                  <div className="flex">
                    <span className="w-44 text-gray-400">
                      Assigned Responder
                    </span>

                    <span>
                      {emergency.assignedResponder
                        ? emergency.assignedResponder.name
                        : "Not Assigned"}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-44 text-gray-400">Shelter</span>

                    <span>
                      {emergency.assignedShelter
                        ? emergency.assignedShelter.name
                        : "Not Assigned"}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-44 text-gray-400">Reported</span>

                    <span>
                      {new Date(emergency.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => setSelectedEmergency(emergency)}
                      className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selectedEmergency && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

    <div className="bg-slate-900 rounded-lg p-6 w-[700px] max-h-[90vh] overflow-y-auto">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold">
          Emergency Details
        </h2>

        <button
          onClick={() => setSelectedEmergency(null)}
          className="text-red-400 text-xl"
        >
          ✕
        </button>

      </div>

      <div className="space-y-4">

        <div>
          <span className="text-gray-400">
            Type
          </span>

          <p className="capitalize">
            {selectedEmergency.emergencyType}
          </p>
        </div>

        <div>
          <span className="text-gray-400">
            Description
          </span>

          <p>
            {selectedEmergency.description}
          </p>
        </div>

        <div>
          <span className="text-gray-400">
            Location
          </span>

          <p className="capitalize">
            {selectedEmergency.locationNode?.replace(
              /([a-z])([A-Z])/g,
              "$1 $2"
            )}
          </p>
        </div>

        <div>
          <span className="text-gray-400">
            Severity
          </span>

          <p>
            {severityMap[selectedEmergency.severity]}
          </p>
        </div>

        <div>
          <span className="text-gray-400">
            Priority Score
          </span>

          <p>
            {selectedEmergency.priorityScore}
          </p>
        </div>

        <div>
          <span className="text-gray-400">
            People Affected
          </span>

          <p>
            {selectedEmergency.affectedPeople}
          </p>
        </div>

        <div>
          <span className="text-gray-400">
            Status
          </span>

          <p>
            {selectedEmergency.status}
          </p>
        </div>

        <div>
          <span className="text-gray-400">
            Assigned Responder
          </span>

          <p>
            {selectedEmergency.assignedResponder
              ? selectedEmergency.assignedResponder.name
              : "Not Assigned"}
          </p>
        </div>

        <div>
          <span className="text-gray-400">
            Assigned Shelter
          </span>

          <p>
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
