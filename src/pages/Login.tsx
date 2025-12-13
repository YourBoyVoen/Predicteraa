import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authApi, ApiError } from "../services";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.login({ username, password });
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Invalid username or password");
        } else if (err.status === 400) {
          setError("Please enter both username and password");
        } else {
          setError("Login failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleLogin} className="w-full max-w-sm sm:max-w-md bg-[#19A7CE] text-white rounded-2xl shadow-xl p-6 sm:p-10">
        
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

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg">
            <p className="text-sm text-white">{error}</p>
          </div>
        )}

        {/* Username */}
        <div className="mt-6 sm:mt-8">
          <label className="text-sm font-medium">User name</label>
          <input 
            type="text" 
            placeholder="Enter your user name" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
            className="w-full mt-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-white text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-300 text-sm disabled:opacity-50"
          />
        </div>

        {/* Password */}
        <div className="mt-5 sm:mt-6">
          <label className="text-sm font-medium">Password</label>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-white text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-300 text-sm disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full mt-6 sm:mt-8 bg-white text-black font-semibold py-2.5 sm:py-3 rounded-md shadow hover:bg-gray-100 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
