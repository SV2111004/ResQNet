import { useEffect } from "react";
import { useState } from "react";

import { useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";

import StatCard from "../components/StatCard";

import EmergencyMap from "../components/EmergencyMap";

import { getResponders } from "../services/userService";
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

        const responderData = await getResponders(user.token);
        const statsData = await getEmergencyStats(user.token);

        setStats(statsData);

        setResponders(responderData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  const [responders, setResponders] = useState([]);

  const assignMission = async (emergencyId) => {
    try {
      if (responders.length === 0) {
        return;
      }

      await createMission(
        {
          emergencyId,
          responderId: responders[0]._id,
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
        <EmergencyMap emergencies={emergencies} />
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
              Affected People:
              {emergency.affectedPeople}
            </p>
            {emergency.assignedResponder ? (
              <div
                className="
    mt-3
    text-green-400"
              >
                Assigned
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
                Assign Responder
              </button>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
