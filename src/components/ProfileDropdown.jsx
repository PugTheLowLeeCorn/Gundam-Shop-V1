import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initial = user?.fullname?.charAt(0)?.toUpperCase()
    || user?.username?.charAt(0)?.toUpperCase()
    || "U";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  const menuItems = user.role === "customer"
    ? [
        { to: "/profile", label: "Profile / Account", icon: "👤" },
        { to: "/orders", label: "My Orders", icon: "📦" },
      ]
    : [
        { to: "/admin", label: "Admin Dashboard", icon: "⚙️" },
      ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-2 sm:gap-3 pl-1.5 pr-2 sm:pr-3 py-1.5 rounded-full border transition-all duration-300 ${
          open
            ? "border-gundam-accent/50 bg-white/10 shadow-lg shadow-gundam-accent/10"
            : "border-white/15 bg-white/5 hover:border-gundam-accent/40 hover:bg-white/8"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-gundam-accent/20 border border-gundam-accent/40 flex items-center justify-center text-sm font-bold text-gundam-accent flex-shrink-0">
          {initial}
        </div>
        <span className="text-sm font-medium text-white/90 max-w-[100px] sm:max-w-[140px] truncate hidden sm:block">
          {user.fullname || user.username}
        </span>
        <svg
          className={`w-4 h-4 text-gundam-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 rounded-2xl border border-white/10 bg-gundam-card/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden animate-fade-in-up z-50">
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <p className="text-sm font-semibold text-white truncate">
              {user.fullname || user.username}
            </p>
            <p className="text-xs text-gundam-muted truncate">@{user.username}</p>
          </div>

          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-gundam-accent hover:bg-white/5 transition-colors"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-white/10 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <span className="text-base">🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
