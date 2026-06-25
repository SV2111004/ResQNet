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
          <div className="flex flex-col gap-2">
            <label>Emergency Type</label>

            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="
      bg-slate-800
      p-3
      rounded
      border
      border-slate-700"
            >
              <option value="flood">Flood</option>
              <option value="earthquake">Earthquake</option>
              <option value="landslide">Landslide</option>
              <option value="cyclone">Cyclone</option>
              <option value="wildfire">Wildfire</option>
              <option value="medical">Medical</option>
              <option value="accident">Accident</option>
              <option value="fire">Fire</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label>Description</label>

            <textarea
              required
              rows="3"
              placeholder="Describe the emergency situation"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="
      bg-slate-800
      p-3
      rounded
      border
      border-slate-700"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Severity (1-5)</label>

            <select
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="
      bg-slate-800
      p-3
      rounded
      border
      border-slate-700"
            >
              <option value={1}>1 - Low</option>
              <option value={2}>2 - Moderate</option>
              <option value={3}>3 - High</option>
              <option value={4}>4 - Critical</option>
              <option value={5}>5 - Extreme</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label>Estimated People Affected</label>

            <input
              type="number"
              min="1"
              value={affectedPeople}
              onChange={(e) => setAffectedPeople(Number(e.target.value))}
              className="
      bg-slate-800
      p-3
      rounded
      border
      border-slate-700"
            />
          </div>
          <button
            type="submit"
            className="
    bg-red-600
    hover:bg-red-700
    px-6
    py-3
    rounded
    font-semibold"
          >
            Create SOS
          </button>
          <button type="submit"></button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default CitizenDashboard;
