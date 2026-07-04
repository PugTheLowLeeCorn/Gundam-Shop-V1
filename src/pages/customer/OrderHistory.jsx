import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerOrdersRequest } from "../../redux/actions/orderActions";
import ProductImage from "../../components/ProductImage";
import EmptyState from "../../components/EmptyState";
import { formatPrice } from "../../utils/formatPrice";
import { formatShippingAddressDisplay } from "../../utils/shippingAddress";

const STATUS_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  shipping: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

function OrderHistory() {
  const dispatch = useDispatch();
  const location = useLocation();
  const orders = useSelector((state) => state.order.customerOrders);
  const loading = useSelector((state) => state.order.loading);

  useEffect(() => {
    dispatch(fetchCustomerOrdersRequest());
  }, [dispatch]);

  const successMessage = location.state?.orderSuccess
    ? "Your order has been placed successfully!"
    : "";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gundam-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sortedOrders = [...orders].reverse();

  return (
    <div className="min-h-screen bg-gundam-dark py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-display text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-gundam-muted mb-10">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        {orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            description="Your order history will appear here after your first purchase."
            action={
              <Link to="/" className="btn-primary">
                Start Shopping
              </Link>
            }
          />
        ) : (
          <div className="space-y-6">
            {sortedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gundam-card border border-white/8 rounded-2xl p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-display text-lg font-bold">Order #{order.id}</h2>
                    <p className="text-sm text-gundam-muted mt-1">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gundam-accent/15 text-gundam-accent border border-gundam-accent/30">
                      {order.paymentMethod || "COD"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                        STATUS_STYLES[order.status] || STATUS_STYLES.pending
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-bold text-gundam-accent">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {order.customerInfo && (
                  <div className="mb-6 p-4 rounded-xl bg-gundam-surface/50 border border-white/5 text-sm">
                    <p className="text-gundam-muted mb-2 text-xs uppercase tracking-wider">Shipping To</p>
                    <p className="font-medium">{order.customerInfo.fullname}</p>
                    <p className="text-gundam-muted">{order.customerInfo.phone}</p>
                    <p className="text-gundam-muted whitespace-pre-line">
                      {formatShippingAddressDisplay(order.customerInfo)}
                    </p>
                    {order.customerInfo.note && (
                      <p className="text-gundam-muted mt-1 italic">Note: {order.customerInfo.note}</p>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-gundam-surface/50 rounded-xl p-3">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-contain rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-gundam-muted">
                          Qty: {item.quantity} · {formatPrice(item.price)} each
                        </p>
                      </div>
                      <p className="font-medium text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
