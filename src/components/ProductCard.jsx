import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useCartContext } from "../context/CartContext";
import ProductImage from "./ProductImage";
import GradeBadge from "./GradeBadge";
import { formatPrice } from "../utils/formatPrice";

function ProductCard({ product, variant = "dark" }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { refreshCartCount } = useCartContext();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const isLight = variant === "light";
  const isSoldOut = product.quantity === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSoldOut) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "customer") return;

    setAdding(true);
    setError("");
    try {
      await addToCart(user.id, product.id);
      await refreshCartCount();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className={`group rounded-2xl overflow-hidden border card-hover ${
        isLight
          ? "bg-white border-gray-200 shadow-sm"
          : "bg-gundam-card border-white/8"
      } ${isSoldOut ? "opacity-90" : ""}`}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className={`relative overflow-hidden ${isLight ? "bg-gray-50" : "bg-gundam-surface"}`}>
          <ProductImage
            src={product.image}
            alt={product.name}
            className={`w-full h-56 object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${
              isSoldOut ? "grayscale-[30%]" : ""
            }`}
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <GradeBadge grade={product.grade} />
            {isSoldOut && (
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-red-500/90 text-white border border-red-400/50">
                Sold Out
              </span>
            )}
          </div>
        </div>

        <div className="p-5">
          <h3
            className={`font-display text-lg font-bold mb-1 line-clamp-1 group-hover:text-gundam-accent transition-colors ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            {product.name}
          </h3>

          <p className={`text-sm mb-3 ${isLight ? "text-gray-500" : "text-gundam-muted"}`}>
            {product.brand}
          </p>

          <p className={`text-xl font-bold mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      <div className="px-5 pb-5">
        {error && (
          <p className="text-red-400 text-xs mb-2">{error}</p>
        )}
        <button
          onClick={handleAddToCart}
          disabled={adding || isSoldOut}
          className={`w-full text-sm py-2.5 flex items-center justify-center gap-2 rounded-full font-semibold transition-all ${
            isSoldOut
              ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              : "btn-primary"
          }`}
        >
          {!isSoldOut && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          )}
          {adding ? "Adding..." : isSoldOut ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
