import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authApi, ApiError } from "../services";
import { useSnackbar } from "../contexts/SnackbarContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't proceed if already loading
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      const response = await authApi.login({ username, password });
      
      // Only proceed if we got a successful response
      if (response?.data?.accessToken && response?.data?.refreshToken) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Show success message
        showSnackbar('Login successful! Redirecting...', 'success');
        
        // Notify other components that user has logged in
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        
        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Stay on login page and show error via snackbar
      let errorMessage = "Login failed. Please try again.";
      
      if (err instanceof ApiError) {
        if (err.status === 401) {
          errorMessage = "Invalid username or password";
        } else if (err.status === 400) {
          errorMessage = "Please enter both username and password";
        } else if (err.status && err.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = "Network error. Please check your connection.";
        }
      }
      
      showSnackbar(errorMessage, 'error');
      setIsLoading(false);
      return; // Explicitly return to prevent any navigation
    }
    
    // Only set loading to false after successful navigation delay
    // (isLoading state will be cleaned up when component unmounts)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleLogin} className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Predictera
          </h1>
          <h2 className="text-xl font-semibold text-gray-800">
            Sign in to your dashboard
          </h2>
          <p className="text-sm mt-2 text-gray-600">
            Enter your credentials to continue
          </p>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input 
            type="text" 
            placeholder="Enter your username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:bg-gray-100"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Password</label>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:bg-gray-100"
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
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
