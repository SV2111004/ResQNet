import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getShelters } from "../services/shelterService";

function Shelters() {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const data = await getShelters();

        setShelters(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchShelters();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Shelter Management
      </h1>

      <div className="grid grid-cols-2 gap-5">
        {shelters.map((shelter) => (
          <div
            key={shelter._id}
            className="bg-slate-900 p-5 rounded-lg"
          >
            <h2 className="text-xl font-bold text-blue-400">
              {shelter.name}
            </h2>

            <p>
              Capacity : {shelter.capacity}
            </p>

            <p>
              Occupied : {shelter.currentOccupancy}
            </p>

            <p>
              Available :
              {shelter.capacity -
                shelter.currentOccupancy}
            </p>

            <p>
              Food :
              {shelter.foodAvailable
                ? " Yes"
                : " No"}
            </p>

            <p>
              Water :
              {shelter.waterAvailable
                ? " Yes"
                : " No"}
            </p>

            <p>
              Status :
              {shelter.status}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Shelters;