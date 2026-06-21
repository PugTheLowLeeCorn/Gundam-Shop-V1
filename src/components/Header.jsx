import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCartContext } from "../context/CartContext";
import ProfileDropdown from "./ProfileDropdown";

function Header() {
  const { user } = useAuth();
  const { cartCount } = useCartContext();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isTransparent = isHome || location.pathname.startsWith("/products/");

  const handleSearchClick = () => {
    if (location.pathname === "/") {
      document.getElementById("hero-search")?.focus();
    } else {
      navigate("/");
    }
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors hover:text-gundam-accent ${
        location.pathname === to ? "text-gundam-accent" : "text-white/80"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent absolute w-full"
          : "bg-gundam-darker/95 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-lg lg:text-xl font-bold tracking-widest border border-white/30 px-3 py-1.5 hover:border-gundam-accent transition-colors"
        >
          GUNDAM.STORE
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLink("/", "Home")}
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="text-sm font-medium text-white/80 hover:text-gundam-accent transition-colors"
          >
            Products
          </button>
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                document.getElementById("grades-section")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="text-sm font-medium text-white/80 hover:text-gundam-accent transition-colors"
          >
            Grades
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleSearchClick}
            aria-label="Search"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-gundam-accent hover:text-gundam-accent transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {user?.role === "customer" && (
            <>
              <Link
                to="/favorite"
                aria-label="Wishlist"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-gundam-accent hover:text-gundam-accent transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              <Link
                to="/cart"
                aria-label="Cart"
                className="relative w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-gundam-accent hover:text-gundam-accent transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gundam-accent text-[10px] font-bold text-white animate-fade-in-up">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm py-2 px-4 hidden sm:inline-flex">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                Register
              </Link>
            </div>
          ) : (
            <ProfileDropdown />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
