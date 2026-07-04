import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomersRequest,
  deleteCustomerRequest,
} from "../../redux/actions/authActions";

function Customers() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.auth.customers);
  const loading = useSelector((state) => state.auth.customersLoading);
  const error = useSelector((state) => state.auth.customersError);

  useEffect(() => {
    dispatch(fetchCustomersRequest());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (!confirm("Delete this customer?")) return;
    dispatch(deleteCustomerRequest(id));
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Customer Management</h1>
      <p className="text-gundam-muted mb-8">{customers.length} customers</p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gundam-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-gundam-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gundam-muted text-left">
                  <th className="p-4 font-medium">ID</th>
                  <th className="p-4 font-medium">Username</th>
                  <th className="p-4 font-medium">Full Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="p-4 text-gundam-muted">{customer.id}</td>
                    <td className="p-4 font-medium">{customer.username}</td>
                    <td className="p-4">{customer.fullname}</td>
                    <td className="p-4 text-gundam-muted">{customer.email}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
                      >
                        Delete
                      </button>
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

export default Customers;
