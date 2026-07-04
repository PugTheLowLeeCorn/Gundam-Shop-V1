import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../../redux/actions/authActions";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerLoading, registerError, registerSuccess } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    email: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (registerSuccess) {
      navigate("/login");
    }
  }, [registerSuccess, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.username.trim()) errors.username = "Username is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password) errors.password = "Password is required";
    if (!form.confirmPassword) errors.confirmPassword = "Confirm password is required";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(registerRequest(form));
  };

  const displayError = registerError || Object.values(fieldErrors).find(Boolean);

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
            Join the Builders
          </h1>
          <p className="text-gundam-muted text-sm">
            Create your GUNDAM.STORE account
          </p>
        </div>

        <div className="space-y-4">
          {[
            { name: "fullname", label: "Full Name", type: "text", placeholder: "Your full name", required: false },
            { name: "email", label: "Email", type: "email", placeholder: "your@email.com", required: true },
            { name: "username", label: "Username", type: "text", placeholder: "Choose a username", required: true },
            { name: "password", label: "Password", type: "password", placeholder: "Create a password", required: true },
            { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm your password", required: true },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm text-gundam-muted mb-2 block">
                {field.label}{field.required ? " *" : ""}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="input-field"
                required={field.required}
              />
              {fieldErrors[field.name] && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        {displayError && !Object.keys(fieldErrors).length && (
          <div className="mt-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {displayError}
          </div>
        )}

        {registerError && (
          <div className="mt-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {registerError}
          </div>
        )}

        <button
          type="submit"
          disabled={registerLoading}
          className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {registerLoading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gundam-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gundam-accent hover:text-orange-300 transition-colors font-medium">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
