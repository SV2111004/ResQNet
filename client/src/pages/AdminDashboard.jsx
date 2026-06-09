import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";

function AdminDashboard() {

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Guwahati Emergency Operations Center
      </h1>

      <div className="grid grid-cols-4 gap-4">

        <StatCard
          title="Active Emergencies"
          value="18"
        />

        <StatCard
          title="Responders Online"
          value="12"
        />

        <StatCard
          title="Active Shelters"
          value="6"
        />

        <StatCard
          title="Flood Zones"
          value="3"
        />

      </div>

      <div className="bg-slate-900 rounded-lg h-[500px] mt-8 flex items-center justify-center">

        LIVE MAP AREA

      </div>

    </DashboardLayout>
  );
}

export default AdminDashboard;