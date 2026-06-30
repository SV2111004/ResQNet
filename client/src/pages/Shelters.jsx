import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getShelters } from "../services/shelterService";

function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [search, setSearch] = useState("");
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
  const filteredShelters = shelters.filter((shelter) =>
    shelter.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalShelters = shelters.length;

  const totalCapacity = shelters.reduce(
    (sum, shelter) => sum + shelter.capacity,
    0,
  );

  const occupiedBeds = shelters.reduce(
    (sum, shelter) => sum + shelter.currentOccupancy,
    0,
  );

  const availableBeds = totalCapacity - occupiedBeds;
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Shelter Management</h1>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 p-5 rounded-lg">
          <p className="text-gray-400">Total Shelters</p>

          <h2 className="text-3xl font-bold mt-2">{totalShelters}</h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-lg">
          <p className="text-gray-400">Total Capacity</p>

          <h2 className="text-3xl font-bold mt-2">{totalCapacity}</h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-lg">
          <p className="text-gray-400">Occupied Beds</p>

          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {occupiedBeds}
          </h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-lg">
          <p className="text-gray-400">Available Beds</p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {availableBeds}
          </h2>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search shelter..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-slate-900 p-3 rounded-lg mb-6"
      />
      <div className="grid grid-cols-2 gap-5">
        {filteredShelters.map((shelter) => (
          <div key={shelter._id} className="bg-slate-900 p-5 rounded-lg">
            <h2 className="text-xl font-bold text-blue-400">{shelter.name}</h2>

            <p>Capacity : {shelter.capacity}</p>

            <p>Occupied : {shelter.currentOccupancy}</p>

            <p>Available :{shelter.capacity - shelter.currentOccupancy}</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Occupancy</span>

                <span>
                  {Math.round(
                    (shelter.currentOccupancy / shelter.capacity) * 100,
                  )}
                  %
                </span>
              </div>

              <div className="w-full bg-slate-700 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    shelter.currentOccupancy / shelter.capacity > 0.8
                      ? "bg-red-500"
                      : shelter.currentOccupancy / shelter.capacity > 0.5
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{
                    width: `${
                      (shelter.currentOccupancy / shelter.capacity) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <p>Food :{shelter.foodAvailable ? " Yes" : " No"}</p>

            <p>Water :{shelter.waterAvailable ? " Yes" : " No"}</p>

            <p>Status :{shelter.status}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Shelters;
