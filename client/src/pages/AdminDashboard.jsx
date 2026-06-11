import { useEffect } from "react";
import { useState } from "react";

import { useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";

import StatCard from "../components/StatCard";

import { getEmergencies } from "../services/emergencyService";
import EmergencyMap from "../components/EmergencyMap";

function AdminDashboard() {
  const [emergencies, setEmergencies] = useState([]);

  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmergencies(user.token);

        setEmergencies(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Guwahati Emergency Operations Center
      </h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Active Emergencies" value={emergencies.length} />

        <StatCard title="Responders Online" value="12" />

        <StatCard title="Active Shelters" value="6" />

        <StatCard title="Flood Zones" value="3" />
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
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
