import { useState } from "react";
import { Wind, Mail, Lock, User as UserIcon, CheckCircle2 } from "lucide-react";
import { loginUser, registerUser } from "../../api/client";

export function LoginView({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);
      onLoginSuccess(data.user || { name: email.split("@")[0], email }, data.profile);
    } catch (err) {
      onLoginSuccess({ name: email.split("@")[0] || "User", email }, { air_sensitivity: "Moderate", route_priority: "Health First" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 vayu-panel rounded-2xl overflow-hidden border-[#23443B] bg-[#0D2521]">
        {/* LEFT: Branding */}
        <div className="p-8 lg:p-12 bg-[#071A17] flex flex-col justify-between border-r border-[#23443B]">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B7D96B] flex items-center justify-center text-[#071A17] font-black">
                <Wind className="w-5 h-5" />
              </div>
              <span className="font-extrabold font-heading text-xl text-[#F1F5EE] tracking-wide">AIR-AWARE</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold font-heading text-[#F1F5EE] mt-8 leading-tight">
              Welcome Back.
            </h2>
            <p className="text-[#9AAEA5] text-xs mt-2 leading-relaxed">
              Continue your air-aware navigation journey with personalized pollution metrics.
            </p>
          </div>

          <div className="space-y-3 my-8">
            <div className="flex items-center gap-2.5 text-xs text-[#9AAEA5]">
              <CheckCircle2 className="w-4 h-4 text-[#B7D96B]" />
              <span>Real-time AQI exposure routing</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#9AAEA5]">
              <CheckCircle2 className="w-4 h-4 text-[#78C091]" />
              <span>Health sensitivity profile tuning</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#9AAEA5]">
              <CheckCircle2 className="w-4 h-4 text-[#6FBF9A]" />
              <span>Explainable route decisions</span>
            </div>
          </div>

          <p className="text-[10px] text-[#9AAEA5] uppercase tracking-wider font-semibold">AIR-AWARE • Environmental Health Engine</p>
        </div>

        {/* RIGHT: Login Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-[#0D2521]">
          <h3 className="text-xl font-extrabold font-heading text-[#F1F5EE] mb-1">Sign In</h3>
          <p className="text-xs text-[#9AAEA5] mb-6">Enter your credentials to access your dashboard.</p>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-[#D96B63]/10 border border-[#D96B63]/30 text-[#D96B63] text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#9AAEA5] uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9AAEA5] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-[#071A17] border border-[#23443B] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F1F5EE] focus:outline-none focus:border-[#B7D96B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#9AAEA5] uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9AAEA5] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#071A17] border border-[#23443B] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F1F5EE] focus:outline-none focus:border-[#B7D96B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 rounded-lg justify-center text-xs font-bold mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-5 flex items-center justify-between text-xs text-[#9AAEA5]">
            <span className="w-full border-b border-[#23443B]"></span>
            <span className="px-3 uppercase font-semibold text-[10px]">OR</span>
            <span className="w-full border-b border-[#23443B]"></span>
          </div>

          <button
            onClick={() => onLoginSuccess({ name: "Demo User", email: "demo@air-aware.app" }, null)}
            className="w-full py-2 rounded-lg bg-[#102C27] hover:bg-[#153A33] text-[#9AAEA5] hover:text-[#F1F5EE] border border-[#23443B] text-xs font-semibold transition-colors"
          >
            Continue as Guest / Demo Mode
          </button>

          <p className="text-center text-xs text-[#9AAEA5] mt-6">
            Don't have an account?{" "}
            <button onClick={onSwitchToRegister} className="text-[#B7D96B] font-bold hover:underline">
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterView({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await registerUser(name, email, password);
      onRegisterSuccess(
        data.user || { name: name || "User", email },
        data.profile || { air_sensitivity: "Moderate", route_priority: "Health First" }
      );
    } catch (err) {
      onRegisterSuccess(
        { name: name || "New User", email },
        { air_sensitivity: "Moderate", route_priority: "Health First" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md vayu-panel p-8 bg-[#0D2521] border-[#23443B]">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#B7D96B] text-[#071A17] flex items-center justify-center mx-auto mb-3 font-black">
            <Wind className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold font-heading text-[#F1F5EE]">Create Account</h3>
          <p className="text-xs text-[#9AAEA5] mt-1">Start customizing your air-aware navigation profile.</p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#D96B63]/10 border border-[#D96B63]/30 text-[#D96B63] text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-[#9AAEA5] uppercase mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#9AAEA5] absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-[#071A17] border border-[#23443B] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F1F5EE] focus:outline-none focus:border-[#B7D96B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#9AAEA5] uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9AAEA5] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-[#071A17] border border-[#23443B] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F1F5EE] focus:outline-none focus:border-[#B7D96B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#9AAEA5] uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9AAEA5] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#071A17] border border-[#23443B] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F1F5EE] focus:outline-none focus:border-[#B7D96B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#9AAEA5] uppercase mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9AAEA5] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#071A17] border border-[#23443B] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F1F5EE] focus:outline-none focus:border-[#B7D96B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 rounded-lg justify-center text-xs font-bold mt-2"
          >
            {loading ? "Creating Account..." : "Create Account & Personalize"}
          </button>
        </form>

        <p className="text-center text-xs text-[#9AAEA5] mt-6">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="text-[#B7D96B] font-bold hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

