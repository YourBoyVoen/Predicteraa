import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // nanti bisa ditambah API call
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md bg-[#19A7CE] text-white rounded-2xl shadow-xl p-6 sm:p-10">
        
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-semibold">
          Welcome to Predictera!
        </h2>

        <h1 className="text-2xl sm:text-3xl font-bold mt-2 leading-tight">
          Sign in to your dashboard!
        </h1>

        <p className="text-xs sm:text-sm mt-1 text-gray-200">
          Please put your username and password
        </p>

        {/* Username */}
        <div className="mt-6 sm:mt-8">
          <label className="text-sm font-medium">User name</label>
          <input type="text" placeholder="Enter your user name" className="w-full mt-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-white text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-300 text-sm"
          />
        </div>

        {/* Password */}
        <div className="mt-5 sm:mt-6">
          <label className="text-sm font-medium">Password</label>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-white text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-300 text-sm"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button 
        onClick={handleLogin}
        className="w-full mt-6 sm:mt-8 bg-white text-black font-semibold py-2.5 sm:py-3 rounded-md shadow hover:bg-gray-100 transition-all text-sm sm:text-base">
          Sign in
        </button>
      </div>
    </div>
  );
}
