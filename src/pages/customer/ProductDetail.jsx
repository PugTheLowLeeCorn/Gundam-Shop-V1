import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useProducts } from "../../hooks/useProducts";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useFavorite } from "../../hooks/useFavorite";
import { useCartContext } from "../../context/CartContext";
import ProductImage from "../../components/ProductImage";
import ProductGrid from "../../components/ProductGrid";
import GradeBadge from "../../components/GradeBadge";
import { formatPrice } from "../../utils/formatPrice";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getAllProducts } = useProducts();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleFavorite } = useFavorite();
  const { refreshCartCount } = useCartContext();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [adding, setAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);

      const data = await getProductById(id);

      if (!data) {
        setNotFound(true);
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(data);

      const allProducts = await getAllProducts();
      const related = allProducts.filter(
        (p) => p.grade === data.grade && p.id !== data.id
      );
      setRelatedProducts(related);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !product) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/favorites?userId=${user.id}&productId=${product.id}`
        );
        setIsFavorite(res.data.length > 0);
      } catch {
        setIsFavorite(false);
      }
    };

    checkFavorite();
  }, [user, product]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "customer") return;

    if (product.quantity <= 0) return;

    setAdding(true);
    setCartError("");
    try {
      await addToCart(user.id, product.id);
      await refreshCartCount();
      setCartMessage("Added to cart!");
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      setCartError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "customer") return;

    await toggleFavorite(user.id, product.id);
    setIsFavorite((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gundam-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6 opacity-30">⚠</div>
          <h1 className="font-display text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gundam-muted mb-8">
            The kit you're looking for doesn't exist or may have been removed from our collection.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            ← Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.quantity > 0;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] hero-gradient">
        <div className="absolute inset-0 cinematic-overlay" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-28 pb-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gundam-muted hover:text-gundam-accent transition-colors mb-8"
          >
            ← Back to Store
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden bg-gundam-surface/60 border border-white/10 p-6 lg:p-10 relative">
              <ProductImage
                src={product.image}
                alt={product.name}
                className={`w-full h-[400px] lg:h-[500px] object-contain ${!inStock ? "grayscale-[30%]" : ""}`}
              />
              {!inStock && (
                <span className="absolute top-6 right-6 px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-full bg-red-500/90 text-white border border-red-400/50">
                  Sold Out
                </span>
              )}
            </div>

            <div className="animate-fade-in-up">
              <div className="mb-4">
                <GradeBadge grade={product.grade} size="lg" />
              </div>

              <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2">
                {product.name}
              </h1>

              <p className="text-gundam-muted text-lg mb-6">{product.brand}</p>

              <p className="text-white/70 leading-relaxed mb-8 max-w-lg">
                {product.description}
              </p>

              <p className="text-3xl lg:text-4xl font-bold mb-8">
                {formatPrice(product.price)}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={adding || !inStock}
                  className="btn-primary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {adding ? "Adding..." : !inStock ? "Out of Stock" : "Add to Cart"}
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFavorite ? "In Wishlist" : "Add to Wishlist"}
                </button>
              </div>

              {cartMessage && (
                <p className="text-green-400 text-sm mb-4">{cartMessage}</p>
              )}

              {cartError && (
                <p className="text-red-400 text-sm mb-4">{cartError}</p>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span className={`w-2.5 h-2.5 rounded-full ${inStock ? "bg-green-400" : "bg-red-400"}`} />
                <span className={inStock ? "text-green-400" : "text-red-400 font-semibold"}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
                {inStock && (
                  <span className="text-gundam-muted">· {product.quantity} available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="section-cream py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Specifications</p>
          <h2 className="font-display text-4xl font-bold mb-12">
            Kit <span className="text-gundam-accent italic">Details</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="space-y-5">
                {[
                  { label: "Brand", value: product.brand },
                  { label: "Grade", value: product.grade },
                  { label: "Scale", value: product.scale || getScale(product.grade) },
                  { label: "Stock", value: `${product.quantity} units` },
                ].map((spec) => (
                  <div key={spec.label} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <span className="text-gray-500 text-sm uppercase tracking-wider">{spec.label}</span>
                    <span className="font-semibold text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-display text-xl font-bold mb-4 text-gray-900">Full Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-gundam-dark">
          <div className="container mx-auto px-4 lg:px-8">
            <p className="text-xs uppercase tracking-widest text-gundam-muted mb-2">Same Grade</p>
            <h2 className="font-display text-4xl font-bold mb-10">
              Related <span className="text-gundam-accent italic">Kits</span>
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}
    </div>
  );
}

function getScale(grade) {
  const scales = { HG: "1/144", RG: "1/144", MG: "1/100", PG: "1/60", SD: "SD" };
  return scales[grade] || "N/A";
}

export default ProductDetail;
