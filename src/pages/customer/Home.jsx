import { useEffect, useState, useMemo } from "react";
import { useProducts } from "../../hooks/useProducts";
import ProductGrid from "../../components/ProductGrid";
import ProductImage from "../../components/ProductImage";
import { GRADES } from "../../utils/grades";

function Home() {
  const { getAllProducts } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeGrade, setActiveGrade] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeGrade) {
      result = result.filter((p) => p.grade === activeGrade);
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.grade.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, search, activeGrade]);

  const featuredProduct = products[0];

  const handleGradeClick = (gradeId) => {
    setActiveGrade((prev) => (prev === gradeId ? null : gradeId));

    document
      .getElementById("products-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearch("");
    setActiveGrade(null);
  };

  const hasFilters = search.trim() || activeGrade;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Banner Background */}
        <img
          src="/banner.png"
          alt="Gundam Workshop Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24 pb-16">

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* Left Content */}
            <div className="animate-fade-in-up">

              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <span className="text-gundam-accent">★</span>
                Premium Bandai Gunpla
              </span>

              <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white">
                Build Your{" "}
                <span className="text-gundam-accent italic">
                  Legend
                </span>
              </h1>

              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Discover authentic Bandai Gundam model kits from
                High Grade to Master Grade.
                Every kit tells a story — start building yours today.
              </p>


              {/* Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  document
                    .getElementById("products-section")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="relative mb-8 max-w-lg"
              >

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search your next build..."
                  className="
                    w-full 
                    bg-white 
                    text-gray-900 
                    rounded-full 
                    py-4 
                    pl-6 
                    pr-14 
                    shadow-lg
                    focus:outline-none
                    focus:ring-2
                    focus:ring-gundam-accent
                  "
                />

                <button
                  type="submit"
                  className="
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    w-10
                    h-10
                    rounded-full
                    bg-gundam-accent
                    hover:bg-gundam-accent-hover
                    transition-colors
                    flex
                    items-center
                    justify-center
                  "
                >
                  🔍
                </button>

              </form>
              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() =>
                    document
                      .getElementById("products-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="
                    bg-gundam-accent
                    hover:bg-gundam-accent-hover
                    text-white
                    px-8
                    py-3
                    rounded-full
                    font-semibold
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    shadow-lg
                  "
                >
                  Shop Now →
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("grades-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="
                    text-white/80
                    hover:text-gundam-accent
                    underline
                    underline-offset-4
                    transition-colors
                  "
                >
                  Browse by Grade
                </button>
              </div>
            </div>

            {/* Featured Gundam */}
            {featuredProduct && (
              <div
                className="hidden lg:block animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div
                  className="
                    relative
                    rounded-3xl
                    overflow-hidden
                    border
                    border-white/10
                    bg-black/30
                    backdrop-blur-sm
                    shadow-[0_0_60px_rgba(255,140,0,0.3)]
                    p-10
                  "
                >
                  <ProductImage
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="
                      w-full
                      h-[500px]
                      object-contain
                      drop-shadow-2xl
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-6
                      left-6
                    "
                  >
                    <p className="font-display text-2xl font-bold text-white">
                      {featuredProduct.name}
                    </p>

                    <p className="text-gundam-accent text-sm">
                      {featuredProduct.grade} · {featuredProduct.brand}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Browse by Grade */}
      <section id="grades-section" className="section-cream py-20">
        <div className="container mx-auto px-4 lg:px-8">

          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
            Browse by Grade
          </p>

          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-12">
            Find Your{" "}
            <span className="text-gundam-accent italic">
              Grade
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">

            {GRADES.map((grade) => {
              const count = products.filter(
                (p) => p.grade === grade.id
              ).length;

              const isActive = activeGrade === grade.id;

              return (
                <button
                  key={grade.id}
                  onClick={() => handleGradeClick(grade.id)}
                  className={`
                    rounded-2xl
                    p-6
                    text-left
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    ${isActive
                      ? "bg-gundam-accent/10 border-2 border-gundam-accent shadow-lg"
                      : "bg-white border-2 border-gray-200 hover:border-gundam-accent/50"
                    }
                  `}
                >

                  <h3 className="text-3xl font-bold text-gundam-accent">
                    {grade.id}
                  </h3>

                  <p className="font-semibold text-gray-900 mt-2">
                    {grade.label}
                  </p>

                  <p className="text-sm text-gray-500">
                    {grade.scale}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {grade.description}
                  </p>

                  <p className="text-xs text-gundam-accent mt-3">
                    {count} kits
                  </p>

                </button>
              );
            })}

          </div>
        </div>
      </section>
      {/* Products Section */}
      <section id="products-section" className="py-20 bg-gundam-dark">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">

            <div>
              <p className="text-xs uppercase tracking-widest text-gundam-muted mb-2">
                {hasFilters
                  ? "Search Results"
                  : "Featured Collection"}
              </p>

              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white">
                {hasFilters ? (
                  <>
                    {filteredProducts.length} Kit
                    {filteredProducts.length !== 1 ? "s" : ""} Found
                  </>
                ) : (
                  <>
                    Premium{" "}
                    <span className="text-gundam-accent italic">
                      Gunpla
                    </span>
                  </>
                )}
              </h2>
            </div>


            {/* Clear filter */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="
                  px-5
                  py-2
                  rounded-full
                  border
                  border-gundam-accent/40
                  text-gundam-accent
                  hover:bg-gundam-accent
                  hover:text-white
                  transition-all
                  duration-300
                "
              >
                Clear Filters ✕
              </button>
            )}

          </div>


          {/* Current filter */}
          {(activeGrade || search) && (
            <div className="flex flex-wrap gap-3 mb-8">

              {activeGrade && (
                <span
                  className="
                    bg-gundam-accent/20
                    text-gundam-accent
                    border
                    border-gundam-accent/30
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-medium
                  "
                >
                  Grade: {activeGrade}
                </span>
              )}


              {search && (
                <span
                  className="
                    bg-white/10
                    text-white
                    rounded-full
                    px-4
                    py-2
                    text-sm
                  "
                >
                  Search: {search}
                </span>
              )}

            </div>
          )}


          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-24">

              <div
                className="
                  w-12
                  h-12
                  border-4
                  border-gundam-accent
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
              />

            </div>

          ) : (

            <ProductGrid
              products={filteredProducts}
              emptyMessage={
                hasFilters
                  ? "No Gundam kits found matching your search."
                  : "No Gundam kits available."
              }
            />

          )}

        </div>
      </section>

    </div>
  );
}

export default Home;