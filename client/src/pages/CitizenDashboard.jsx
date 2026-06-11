import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";

import { createEmergency } from "../services/emergencyService";

function CitizenDashboard() {
  const [emergencyType, setEmergencyType] = useState("flood");

  const [description, setDescription] = useState("");

  const [severity, setSeverity] = useState(1);

  const [affectedPeople, setAffectedPeople] = useState(1);

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createEmergency(
        {
          emergencyType,
          description,

          lat,
          lng,

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
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);
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
        <p className="mb-4 text-green-400">
          {lat ? "Location captured" : "Fetching location..."}
        </p>
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
