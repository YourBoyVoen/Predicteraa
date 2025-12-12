import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = () => {
    setIsProcessing(true);

    // Hapus token atau data login
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 700);
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
