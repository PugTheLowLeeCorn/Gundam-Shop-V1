import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFavorite } from "../../hooks/useFavorite";
import ProductImage from "../../components/ProductImage";
import GradeBadge from "../../components/GradeBadge";
import EmptyState from "../../components/EmptyState";
import { formatPrice } from "../../utils/formatPrice";

function Favorite() {
  const { user } = useAuth();
  const { getFavoriteDetail, toggleFavorite } = useFavorite();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorite = async () => {
    setLoading(true);
    const data = await getFavoriteDetail(user.id);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadFavorite();
  }, []);

  const handleRemove = async (productId) => {
    await toggleFavorite(user.id, productId);
    loadFavorite();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gundam-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gundam-dark py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-display text-4xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gundam-muted mb-10">
          {items.length} saved kit{items.length !== 1 ? "s" : ""}
        </p>

        {items.length === 0 ? (
          <EmptyState
            icon="♡"
            title="Your wishlist is empty"
            description="Save your favorite Gunpla kits to build your dream collection."
            action={
              <Link to="/" className="btn-primary">
                Browse Collection
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 sm:gap-6 bg-gundam-card border border-white/8 rounded-2xl p-4 sm:p-6 card-hover"
              >
                <Link to={`/products/${item.productId}`}>
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain bg-gundam-surface rounded-xl p-2"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <GradeBadge grade={item.grade} />
                      <Link to={`/products/${item.productId}`}>
                        <h2 className="font-display text-lg font-bold mt-2 hover:text-gundam-accent transition-colors">
                          {item.name}
                        </h2>
                      </Link>
                      <p className="text-gundam-accent font-bold mt-2">{formatPrice(item.price)}</p>
                    </div>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="btn-ghost text-sm py-2 px-4 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorite;
