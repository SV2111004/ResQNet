import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import ResponderDashboard from "./pages/ResponderDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import Shelters from "./pages/Shelters";
import Emergencies from "./pages/Emergencies";
import Responders from "./pages/Responders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/citizen"
          element={
            <RoleProtectedRoute allowedRole="citizen">
              <CitizenDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/responder"
          element={
            <RoleProtectedRoute allowedRole="responder">
              <ResponderDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/shelters"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <Shelters />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/emergencies"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <Emergencies />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/responders"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <Responders />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
