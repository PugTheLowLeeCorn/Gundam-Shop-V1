import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gundam-dark py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <h1 className="font-display text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-gundam-muted mb-10">Manage your account</p>

        <div className="bg-gundam-card border border-white/8 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gundam-accent/20 border border-gundam-accent/30 flex items-center justify-center text-2xl font-display font-bold text-gundam-accent">
              {user.fullname?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">{user.fullname}</h2>
              <p className="text-gundam-muted text-sm">@{user.username}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              { label: "Username", value: user.username },
              { label: "Full Name", value: user.fullname },
              { label: "Role", value: user.role },
            ].map((field) => (
              <div key={field.label} className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-gundam-muted text-sm">{field.label}</span>
                <span className="font-medium capitalize">{field.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/orders" className="btn-secondary text-sm">
              Order History
            </Link>
            <Link to="/cart" className="btn-secondary text-sm">
              My Cart
            </Link>
            <Link to="/favorite" className="btn-secondary text-sm">
              Wishlist
            </Link>
            <button onClick={logout} className="btn-ghost text-sm text-red-400 border-red-400/30 hover:border-red-400">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
