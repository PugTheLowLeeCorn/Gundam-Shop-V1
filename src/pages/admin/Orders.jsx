import { useEffect, useState } from "react";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";

const STATUS_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-400",
  shipping: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const response = await axios.get("http://localhost:8000/orders");
    setOrders(response.data.reverse());
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:8000/orders/${id}`, { status });
    loadOrders();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Order Management</h1>
      <p className="text-gundam-muted mb-8">{orders.length} orders</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gundam-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gundam-card border border-white/8 rounded-2xl p-12 text-center text-gundam-muted">
          No orders yet
        </div>
      ) : (
        <div className="bg-gundam-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gundam-muted text-left">
                  <th className="p-4 font-medium">ID</th>
                  <th className="p-4 font-medium">User ID</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Payment</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="p-4">#{order.id}</td>
                    <td className="p-4 text-gundam-muted">{order.userId}</td>
                    <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="p-4 text-gundam-muted">{order.paymentMethod || "COD"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-gundam-muted">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="input-field !rounded-lg !py-2 !text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipping">Shipping</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
