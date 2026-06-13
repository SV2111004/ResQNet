import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";

import { getMyMissions } from "../services/missionService";

import { acceptMission } from "../services/missionService";

import { completeMission } from "../services/missionService";

function ResponderDashboard() {
  const [missions, setMissions] = useState([]);

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

      <h2
        className="
        text-xl
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
        missions.map((mission) => (
          <div
            key={mission._id}
            className="
                bg-slate-900
                p-5
                rounded-lg
                mb-4"
          >
            <h3
              className="
                  text-lg
                  font-bold"
            >
              🚨 {mission.emergency?.emergencyType}
            </h3>

            <p className="mt-2">Priority: {mission.emergency?.priorityScore}</p>

            <p>Status: {mission.status}</p>

            <p>Description: {mission.emergency?.description}</p>

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
        ))
      )}
    </DashboardLayout>
  );
}

export default ResponderDashboard;
