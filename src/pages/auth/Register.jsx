import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    fullname: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 cinematic-overlay" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-gundam-card/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-10"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Join the Builders</h1>
          <p className="text-gundam-muted text-sm">Create your GUNDAM.STORE account</p>
        </div>

        <div className="space-y-4">
          {[
            { name: "fullname", label: "Full Name", type: "text", placeholder: "Your full name" },
            { name: "email", label: "Email", type: "email", placeholder: "your@email.com" },
            { name: "username", label: "Username", type: "text", placeholder: "Choose a username" },
            { name: "password", label: "Password", type: "password", placeholder: "Create a password" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm text-gundam-muted mb-1.5 block">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="input-field"
                required
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="w-full btn-primary mt-6">
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gundam-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gundam-accent hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
