import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../redux/features/authSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-64 bg-slate-900 p-4">
      <h1 className="text-2xl font-bold mb-8">ResQNet</h1>

      <div className="flex flex-col gap-4">
        <Link to="/admin">Dashboard</Link>

        <Link to="/emergencies">Emergencies</Link>

        <Link to="/responders">Responders</Link>

        <Link to="/shelters">Shelters</Link>

        <button onClick={handleLogout} className="mt-8 bg-red-600 p-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
