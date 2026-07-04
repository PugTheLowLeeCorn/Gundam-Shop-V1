import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../../redux/actions/authActions";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const wasLoading = useRef(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (wasLoading.current && !loading && user && !error) {
      navigate(user.role === "admin" ? "/admin" : "/");
    }
    wasLoading.current = loading;
  }, [loading, user, error, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginRequest(form));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <img
        src="/banner.png"
        alt="Gundam Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/75" />

      <div
        className="
          absolute
          w-[700px]
          h-[700px]
          bg-gundam-accent/20
          rounded-full
          blur-3xl
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
        "
      />

      <form
        onSubmit={handleSubmit}
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-gundam-card/70
          backdrop-blur-xl
          border
          border-white/10
          rounded-3xl
          p-8
          lg:p-10
          shadow-[0_0_45px_rgba(255,140,0,0.25)]
        "
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gundam-muted text-sm">
            Sign in to your GUNDAM.STORE account
          </p>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gundam-muted mb-2 block">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="input-field"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gundam-muted mb-2 block">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="input-field"
            required
          />
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-gundam-muted mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-gundam-accent hover:text-orange-300 transition-colors font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
