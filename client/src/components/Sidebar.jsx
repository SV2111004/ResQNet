import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/features/authSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-64 bg-slate-900 p-4">
      <h1 className="text-2xl font-bold mb-8">ResQNet</h1>

      <div className="flex flex-col gap-4">
        {user?.role === "admin" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/emergencies">Emergencies</Link>
            <Link to="/responders">Responders</Link>
            <Link to="/shelters">Shelters</Link>
          </>
        )}

        {user?.role === "responder" && (
          <>
            <Link to="/responder">My Missions</Link>
          </>
        )}

        {user?.role === "citizen" && (
          <>
            <Link to="/citizen">Emergency SOS</Link>
          </>
        )}

        <button onClick={handleLogout} className="mt-8 bg-red-600 p-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
