import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services";

export default function LogoutPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = async () => {
    setIsProcessing(true);

    try {
      // Call backend logout API
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    }

    // Clear tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Navigate to login
    navigate("/login", { replace: true });
    setIsProcessing(false);
  };

  const handleCancel = () => {
    navigate(-1); // kembali ke halaman sebelumnya
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 max-w-md w-full text-center">

        <h1 className="text-2xl font-bold text-gray-800">
          Confirm Logout
        </h1>

        <p className="text-gray-600 mt-3">
          Are you sure you want to logout from this account?
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">

          <button
            onClick={handleLogout}
            disabled={isProcessing}
            className="bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 transition"
          >
            {isProcessing ? "Logging out..." : "Yes, Logout"}
          </button>

          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="bg-gray-200 text-gray-800 py-2.5 rounded-xl hover:bg-gray-300 transition"
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
}
