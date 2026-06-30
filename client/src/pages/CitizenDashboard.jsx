import { useEffect, useState } from "react";



import DashboardLayout from "../layouts/DashboardLayout";

import { createEmergency } from "../services/emergencyService";

import { useSelector, useDispatch } from "react-redux";

function CitizenDashboard() {
  const [emergencyType, setEmergencyType] = useState("flood");

  const [description, setDescription] = useState("");

  const [severity, setSeverity] = useState(1);

  const [affectedPeople, setAffectedPeople] = useState(1);

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createEmergency(
        {
          emergencyType,
          description: description || "Emergency reported",

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
      <div className="mb-8">
        <h1 className="text-4xl font-bold">🚨 Emergency SOS</h1>

        <p className="text-slate-400 mt-2">
          Stay calm. Report your emergency and our responders will be notified
          immediately.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
        <div
          className={`mb-6 p-4 rounded-xl border ${
            lat
              ? "bg-green-900/30 border-green-700"
              : "bg-yellow-900/30 border-yellow-700"
          }`}
        >
          <p className={lat ? "text-green-400" : "text-yellow-400"}>
            {lat
              ? "📍 Location captured successfully"
              : "📡 Fetching your location..."}
          </p>

          {lat && (
            <p className="text-xs text-slate-400 mt-2">
              Your live location will be shared only for this emergency.
            </p>
          )}
        </div>

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
            <label>Description (Optional)</label>

            <textarea
              rows="3"
              placeholder="Describe anything that can help responders..."
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

          <div className="grid md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label>Severity</label>

              <select
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="bg-slate-800 p-3 rounded border border-slate-700"
              >
                <option value={1}>1 • Low</option>
                <option value={2}>2 • Moderate</option>
                <option value={3}>3 • High</option>
                <option value={4}>4 • Critical</option>
                <option value={5}>5 • Extreme</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label>People Affected</label>

              <input
                type="number"
                min="1"
                value={affectedPeople}
                onChange={(e) => setAffectedPeople(Number(e.target.value))}
                className="bg-slate-800 p-3 rounded border border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="
  w-full
  mt-4
  py-4
  rounded-xl
  bg-gradient-to-r
  from-red-600
  to-red-700
  hover:from-red-700
  hover:to-red-800
  font-bold
  text-lg
  transition-all
  duration-200
  shadow-lg"
          >
            🚨 SEND EMERGENCY SOS
          </button>
          <button type="submit"></button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default CitizenDashboard;
