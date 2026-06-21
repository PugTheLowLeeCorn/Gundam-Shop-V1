import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gundam-darker border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display text-xl font-bold tracking-widest border border-white/20 inline-block px-3 py-1 mb-4">
              GUNDAM.STORE
            </h3>
            <p className="text-gundam-muted text-sm leading-relaxed max-w-xs">
              Your premium destination for authentic Bandai Gunpla model kits. Build your legend, one kit at a time.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gundam-accent">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2 text-sm text-gundam-muted">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gundam-accent">
              Grades
            </h4>
            <div className="flex flex-wrap gap-2 text-sm text-gundam-muted">
              {["HG", "RG", "MG", "PG", "SD"].map((grade) => (
                <span
                  key={grade}
                  className="px-3 py-1 rounded-full border border-white/10 hover:border-gundam-accent/40 transition-colors"
                >
                  {grade}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center text-sm text-gundam-muted">
          <p>© 2026 GUNDAM.STORE — All Rights Reserved. Premium Bandai Gunpla Collection.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
