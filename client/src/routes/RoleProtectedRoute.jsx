import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RoleProtectedRoute({
  children,
  allowedRole,
}) {
  const { user } = useSelector(
    (state) => state.auth
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.user.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default RoleProtectedRoute;