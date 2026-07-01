import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

import { loginUser } from "../services/authService";
import { setCredentials } from "../redux/features/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      dispatch(setCredentials(data));

      const role = data.user.role;

      toast.success(`Welcome back, ${data.user.name?.split(" ")[0] || "there"}`);

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "responder") {
        navigate("/responder");
      } else {
        navigate("/citizen");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Decorative grid lives on its own layer so its edge-fade mask only
          ever clips the grid pattern, never the form/buttons above it. */}
      <div className="radar-grid absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="pulse-dot w-2.5 h-2.5 text-[var(--accent-emergency)]" />
            <span className="font-display text-xl font-bold">ResQNet</span>
          </Link>
          <h1 className="text-2xl font-bold font-display">Welcome back</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1.5">
            Sign in to continue to your dashboard
          </p>
        </div>

        <div className="bg-[var(--bg-surface)] p-8 rounded-2xl shadow-xl border border-[var(--border-subtle)]">
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                <input
                  type="password"
                  required
                  autoComplete="off"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[var(--accent-info)] hover:bg-[#3d7aef] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? "Signing in…" : "Login"}
              {!loading && <FiArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-[var(--accent-info)] hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>

        <p className="text-center text-[var(--text-muted)] text-xs mt-6">
          Emergency Response &amp; Disaster Management Platform
        </p>
      </div>
    </div>
  );
}

export default Login;
