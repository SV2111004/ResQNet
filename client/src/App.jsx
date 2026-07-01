import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import ResponderDashboard from "./pages/ResponderDashboard";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import Shelters from "./pages/Shelters";
import Emergencies from "./pages/Emergencies";
import Responders from "./pages/Responders";

import ReportEmergency from "./pages/citizen/ReportEmergency";
import MyReports from "./pages/citizen/MyReports";
import SafetyResources from "./pages/citizen/SafetyResources";
import Feedback from "./pages/citizen/Feedback";

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
          path="/citizen/report"
          element={
            <RoleProtectedRoute allowedRole="citizen">
              <ReportEmergency />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/citizen/my-reports"
          element={
            <RoleProtectedRoute allowedRole="citizen">
              <MyReports />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/citizen/safety"
          element={
            <RoleProtectedRoute allowedRole="citizen">
              <SafetyResources />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/citizen/feedback"
          element={
            <RoleProtectedRoute allowedRole="citizen">
              <Feedback />
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
