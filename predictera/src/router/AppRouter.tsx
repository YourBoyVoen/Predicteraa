import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import ContactPage from "../pages/Contact";

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect default → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}; 

export default AppRouter;
