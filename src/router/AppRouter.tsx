import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import LogoutPage from "../pages/Logout";
import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import ContactPage from "../pages/Contact";
import AgentPage from "../pages/Agent";
import MachinePage from "../pages/Machine";
import HistoryPage from "../pages/History";
import NotificationPage from "../pages/Notification";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect default → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<LogoutPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/agent" element={<ProtectedRoute><AgentPage /></ProtectedRoute>} />
      <Route path="/machine" element={<ProtectedRoute><MachinePage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      <Route path="/notification" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
    </Routes>
  );
}; 

export default AppRouter;
