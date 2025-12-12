import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import LogoutPage from "../pages/Logout";
import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import ContactPage from "../pages/Contact";
import AgentPage from "../pages/Agent";

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect default → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agent" element={<AgentPage />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}; 

export default AppRouter;
