import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [products, users, orders] = await Promise.all([
        axios.get("http://localhost:8000/products"),
        axios.get("http://localhost:8000/users?role=customer"),
        axios.get("http://localhost:8000/orders"),
      ]);

      setStats({
        products: products.data.length,
        customers: users.data.length,
        orders: orders.data.length,
      });
      setLoading(false);
    };
    loadData();
  }, []);

  const cards = [
    { label: "Products", value: stats.products, icon: "📦", color: "text-gundam-accent" },
    { label: "Customers", value: stats.customers, icon: "👥", color: "text-blue-400" },
    { label: "Orders", value: stats.orders, icon: "🛒", color: "text-green-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gundam-muted mb-8">Overview of your Gundam store</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gundam-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-gundam-card border border-white/8 rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{card.icon}</span>
                <span className={`text-4xl font-bold ${card.color}`}>{card.value}</span>
              </div>
              <h2 className="text-gundam-muted text-sm uppercase tracking-wider">{card.label}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
