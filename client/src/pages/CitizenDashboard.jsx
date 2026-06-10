import { useState } from "react";

import { useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";

import { createEmergency } from "../services/emergencyService";

function CitizenDashboard() {
  const [emergencyType, setEmergencyType] = useState("flood");

  const [description, setDescription] = useState("");

  const [severity, setSeverity] = useState(1);

  const [affectedPeople, setAffectedPeople] = useState(1);
  const { user } = useSelector((state) => state.auth);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createEmergency(
        {
          emergencyType,
          description,

          lat: 26.1445,
          lng: 91.7362,

          severity,
          affectedPeople,
        },

        user.token,
      );

      alert("SOS Created");
    } catch (error) {
      console.log(error);
    }
  };
  console.log("USER:", user);
  return (
    <DashboardLayout>
      <h1
        className="
      text-3xl
      font-bold
      mb-6"
      >
        Citizen Dashboard
      </h1>

      <div
        className="
      bg-slate-900
      p-6
      rounded-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
          >
            <option value="flood">Flood</option>

            <option value="fire">Fire</option>

            <option value="medical">Medical</option>

            <option value="accident">Accident</option>
          </select>

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Severity"
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Affected People"
            value={affectedPeople}
            onChange={(e) => setAffectedPeople(Number(e.target.value))}
          />

          <button type="submit">Create SOS</button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default CitizenDashboard;
