import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useCartContext } from "../../context/CartContext";
import ProductImage from "../../components/ProductImage";
import EmptyState from "../../components/EmptyState";
import { formatPrice } from "../../utils/formatPrice";

function Cart() {
  const { user } = useAuth();
  const { getCartDetail, removeCartItem, updateQuantity } = useCart();
  const { refreshCartCount } = useCartContext();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    setLoading(true);
    const data = await getCartDetail(user.id);
    setItems(data);
    setLoading(false);
    await refreshCartCount();
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleDelete = async (id) => {
    await removeCartItem(id);
    loadCart();
  };

  const handleQuantityChange = async (id, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) return;
    await updateQuantity(id, newQty);
    loadCart();
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
        <h1 className="font-display text-4xl font-bold mb-2">My Cart</h1>
        <p className="text-gundam-muted mb-10">
          {items.length} item{items.length !== 1 ? "s" : ""} in your cart
        </p>

        {items.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            description="Browse our premium Gunpla collection and add your favorite kits."
            action={
              <Link to="/" className="btn-primary">
                Start Shopping
              </Link>
            }
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 sm:gap-6 bg-gundam-card border border-white/8 rounded-2xl p-4 sm:p-6"
                >
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain bg-gundam-surface rounded-xl p-2 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-lg font-bold mb-1 truncate">{item.name}</h2>
                    <p className="text-gundam-accent font-bold mb-1">{formatPrice(item.price)}</p>
                    <p className="text-xs text-gundam-muted mb-4">
                      {item.stock} in stock
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-gundam-surface rounded-full border border-white/10">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                          className="w-8 h-8 flex items-center justify-center hover:text-gundam-accent transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                          className="w-8 h-8 flex items-center justify-center hover:text-gundam-accent transition-colors"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="font-bold text-lg hidden sm:block">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gundam-card border border-white/8 rounded-2xl p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-gundam-muted">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gundam-muted">
                    <span>Shipping</span>
                    <span>Free (COD)</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-gundam-accent">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="w-full btn-primary block text-center">
                  Proceed to Checkout
                </Link>

                <p className="text-xs text-gundam-muted text-center mt-4">
                  Cash on Delivery available at checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
