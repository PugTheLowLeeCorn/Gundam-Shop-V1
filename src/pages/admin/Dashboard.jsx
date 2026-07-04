import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStatsRequest } from "../../redux/actions/orderActions";
import { formatPrice } from "../../utils/formatPrice";

function Dashboard() {
  const dispatch = useDispatch();
  const { dashboardStats, statsLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchDashboardStatsRequest());
  }, [dispatch]);

  const cards = [
    { label: "Products", value: dashboardStats.products, icon: "📦", color: "text-gundam-accent" },
    { label: "Customers", value: dashboardStats.customers, icon: "👥", color: "text-blue-400" },
    { label: "Orders", value: dashboardStats.orders, icon: "🛒", color: "text-green-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gundam-muted mb-8">Overview of your Gundam store</p>

      {statsLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gundam-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          <div className="bg-gundam-card border border-white/8 rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold mb-6">Revenue Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-gundam-accent/10 border border-gundam-accent/20">
                <p className="text-gundam-muted text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gundam-accent">
                  {formatPrice(dashboardStats.totalRevenue)}
                </p>
                <p className="text-xs text-gundam-muted mt-1">From completed orders only</p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-gundam-muted text-sm mb-1">Completed Orders</p>
                <p className="text-2xl font-bold text-green-400">
                  {dashboardStats.completedOrders}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-gundam-muted text-sm mb-1">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {dashboardStats.pendingOrders}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
