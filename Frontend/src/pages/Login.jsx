import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const popularDomains = [
    "@gmail.com",
    "@yahoo.com",
    "@outlook.com",
    "@hotmail.com",
    "@icloud.com",
    "@proton.me"
  ];

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 4000);
  };

  // Handle email input and generate suggestions
  const handleEmailChange = (value) => {
    setEmail(value);
    
    if (value && !value.includes("@")) {
      const suggestions = popularDomains.map(domain => value + domain);
      setEmailSuggestions(suggestions);
      setShowSuggestions(true);
    } else if (value.includes("@")) {
      const [username, domain] = value.split("@");
      if (username && domain) {
        const matchingSuggestions = popularDomains
          .filter(d => d.toLowerCase().includes("@" + domain.toLowerCase()))
          .map(d => username + d);
        setEmailSuggestions(matchingSuggestions);
        setShowSuggestions(matchingSuggestions.length > 0);
      } else if (username) {
        const suggestions = popularDomains.map(domain => username + domain);
        setEmailSuggestions(suggestions);
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // Select suggestion
  const selectSuggestion = (suggestion) => {
    setEmail(suggestion);
    setShowSuggestions(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please enter both email and password", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => navigate("/slots"), 1500);

    } catch (err) {
      showToast(err.response?.data?.message || "Login failed. Please check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400 relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-toast-in">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border-2 ${
            toast.type === "success" 
              ? "bg-green-500/95 border-green-400 text-white" 
              : "bg-red-500/95 border-red-400 text-white"
          }`}>
            <span className="text-2xl">
              {toast.type === "success" ? "✓" : "⚠️"}
            </span>
            <p className="font-semibold text-base">{toast.message}</p>
            <button 
              onClick={() => setToast({ show: false, message: "", type: "" })}
              className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl">⚽</span>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">
              Login to continue booking your favorite turfs
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  onFocus={() => email && !email.includes("@") && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all duration-300 text-gray-800"
                  autoComplete="email"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  📧
                </span>
              </div>

              {/* Email Suggestions Dropdown */}
              {showSuggestions && emailSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden z-20 animate-dropdown">
                  {emailSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors duration-200 flex items-center gap-3 group"
                    >
                      <span className="text-gray-400 group-hover:text-green-500 transition-colors">📧</span>
                      <span className="text-gray-700 group-hover:text-green-600 font-medium">
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all duration-300 text-gray-800"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                onClick={() => showToast("Password reset feature coming soon!", "error")}
                className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  Register here
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <button
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <span>←</span>
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-white text-xs font-semibold">Fast Login</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-white text-xs font-semibold">Secure</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="text-2xl mb-1">🏏</div>
            <p className="text-white text-xs font-semibold">Book Now</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toast-in {
          from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0); 
          }
        }
        @keyframes dropdown {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-toast-in { animation: toast-in 0.4s ease-out; }
        .animate-dropdown { animation: dropdown 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default Login;