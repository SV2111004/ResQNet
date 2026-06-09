import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import ResponderDashboard from "./pages/ResponderDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";

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
          path="/admin"
          element={
            <RoleProtectedRoute allowedRole="citizen">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRole="responder">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
