import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";
import { getResponders } from "../services/userService";

function Responders() {
  const { user } = useSelector((state) => state.auth);

  const [responders, setResponders] = useState([]);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");

  useEffect(() => {
    const fetchResponders = async () => {
      try {
        const data = await getResponders(user.token);
        setResponders(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchResponders();
  }, [user]);

  const filteredResponders = responders.filter((responder) => {
    const matchesSearch =
      responder.name.toLowerCase().includes(search.toLowerCase()) ||
      responder.email.toLowerCase().includes(search.toLowerCase());

    const matchesAvailability =
      availability === "all"
        ? true
        : availability === "available"
          ? responder.isAvailable
          : !responder.isAvailable;

    return matchesSearch && matchesAvailability;
  });

  const total = responders.length;
  const available = responders.filter((r) => r.isAvailable).length;
  const busy = responders.filter((r) => !r.isAvailable).length;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Responders</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-5">
          <p className="text-gray-400">Total Responders</p>
          <h2 className="text-3xl font-bold mt-2">{total}</h2>
        </div>

        <div className="bg-slate-900 rounded-lg p-5">
          <p className="text-gray-400">Available</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {available}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-lg p-5">
          <p className="text-gray-400">Busy</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">{busy}</h2>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search responder..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-slate-900 rounded-lg p-3"
        />

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="bg-slate-900 rounded-lg px-4"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {filteredResponders.map((responder) => (
          <div key={responder._id} className="bg-slate-900 rounded-lg p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{responder.name}</h2>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  responder.isAvailable ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {responder.isAvailable ? "Available" : "Busy"}
              </span>
            </div>

            <div className="mt-5 space-y-2">
              <p>
                <span className="text-gray-400">Email:</span> {responder.email}
              </p>

              {/* <p>
                <span className="text-gray-400">Phone:</span>{" "}
                {responder.phone || "-"}
              </p> */}

              <p>
                <span className="text-gray-400">Location:</span>{" "}
                {responder.locationNode || "-"}
              </p>

              <div>
                <p>
                  <span className="text-gray-400">Current Mission:</span>{" "}
                  {responder.currentMission ? (
                    <span className="capitalize font-semibold">
                      {responder.currentMission}
                    </span>
                  ) : (
                    "No Active Mission"
                  )}
                </p>

                {responder.missionStatus && (
                  <p className="mt-1 text-sm text-yellow-400 capitalize">
                    Status : {responder.missionStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Responders;
