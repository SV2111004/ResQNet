import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight } from "react-icons/fi";

import { registerUser } from "../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        phone,
        password,
      });

      toast.success("Registration successful — please log in");

      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "name", label: "Full name", type: "text", value: name, onChange: setName, placeholder: "Jordan Lee", icon: FiUser },
    { id: "email", label: "Email", type: "email", value: email, onChange: setEmail, placeholder: "you@example.com", icon: FiMail },
    { id: "phone", label: "Phone", type: "text", value: phone, onChange: setPhone, placeholder: "+1 555 000 0000", icon: FiPhone },
    { id: "password", label: "Password", type: "password", value: password, onChange: setPassword, placeholder: "Create a password", icon: FiLock },
  ];

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
          <h1 className="text-2xl font-bold font-display">Create your account</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1.5">
            Join the network that keeps people safe
          </p>
        </div>

        <div className="bg-[var(--bg-surface)] p-8 rounded-2xl shadow-xl border border-[var(--border-subtle)]">
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            {fields.map(({ id, label, type, value, onChange, placeholder, icon: Icon }) => (
              <div key={id}>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  {label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                  <input
                    type={type}
                    required
                    autoComplete={type === "password" ? "new-password" : "off"}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[var(--accent-info)] hover:bg-[#3d7aef] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? "Creating account…" : "Register"}
              {!loading && <FiArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--accent-info)] hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
