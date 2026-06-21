import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/products", label: "Products", icon: "📦" },
  { to: "/admin/orders", label: "Orders", icon: "🛒" },
  { to: "/admin/customers", label: "Customers", icon: "👥" },
];

function AdminLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gundam-dark">
      <aside className="w-64 bg-gundam-darker border-r border-white/5 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/5">
          <h1 className="font-display text-lg font-bold tracking-widest text-gundam-accent">
            GUNDAM ADMIN
          </h1>
          <p className="text-sm text-gundam-muted mt-2">Hello, {user?.username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.to)
                  ? "bg-gundam-accent/15 text-gundam-accent border border-gundam-accent/20"
                  : "text-gundam-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gundam-muted hover:text-white transition-colors"
          >
            ← Back to Store
          </Link>
          <button onClick={logout} className="w-full btn-ghost text-sm text-red-400 border-red-400/20">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
