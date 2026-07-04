import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateProfileRequest } from "../../redux/actions/authActions";
import ShippingAddressFields from "../../components/ShippingAddressFields";
import {
  buildFullShippingAddress,
  emptyShippingAddress,
  resolveShippingAddress,
} from "../../utils/shippingAddress";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { profileLoading, profileError, profileSuccess } = useSelector(
    (state) => state.auth
  );

  const savedAddress = resolveShippingAddress(user);

  const [address, setAddress] = useState(() => ({
    ...emptyShippingAddress(),
    ...(savedAddress || {}),
  }));

  const [fieldErrors, setFieldErrors] = useState({});

  const validateAddress = () => {
    const errors = {};

    if (!address.provinceCode) errors.provinceCode = "Province is required";
    if (!address.wardCode) errors.wardCode = "Ward is required";
    if (!address.streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    const fullShippingAddress = buildFullShippingAddress(
      address.streetAddress,
      address.wardName,
      address.provinceName
    );

    dispatch(
      updateProfileRequest({
        shippingAddress: {
          provinceCode: address.provinceCode,
          provinceName: address.provinceName,
          wardCode: address.wardCode,
          wardName: address.wardName,
          streetAddress: address.streetAddress.trim(),
          fullShippingAddress,
        },
      })
    );
  };

  return (
    <div className="min-h-screen bg-gundam-dark py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <h1 className="font-display text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-gundam-muted mb-10">Manage your account</p>

        <div className="bg-gundam-card border border-white/8 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gundam-accent/20 border border-gundam-accent/30 flex items-center justify-center text-2xl font-display font-bold text-gundam-accent">
              {user.fullname?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">{user.fullname}</h2>
              <p className="text-gundam-muted text-sm">@{user.username}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              { label: "Username", value: user.username },
              { label: "Full Name", value: user.fullname },
              { label: "Role", value: user.role },
            ].map((field) => (
              <div
                key={field.label}
                className="flex justify-between items-center py-3 border-b border-white/5"
              >
                <span className="text-gundam-muted text-sm">{field.label}</span>
                <span className="font-medium capitalize">{field.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/orders" className="btn-secondary text-sm">
              Order History
            </Link>
            <Link to="/cart" className="btn-secondary text-sm">
              My Cart
            </Link>
            <Link to="/favorite" className="btn-secondary text-sm">
              Wishlist
            </Link>
            <button
              onClick={() => dispatch(logout())}
              className="btn-ghost text-sm text-red-400 border-red-400/30 hover:border-red-400"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-gundam-card border border-white/8 rounded-2xl p-8">
          <h2 className="font-display text-xl font-bold mb-2">Shipping Address</h2>
          <p className="text-gundam-muted text-sm mb-6">
            Saved address will be pre-filled at checkout.
          </p>

          <form onSubmit={handleSaveAddress}>
            <div className="grid sm:grid-cols-2 gap-4">
              <ShippingAddressFields
                value={address}
                onChange={(nextAddress) => {
                  setAddress(nextAddress);
                  setFieldErrors({});
                }}
                errors={fieldErrors}
              />
            </div>

            {profileError && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                Address saved successfully.
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="btn-primary mt-6"
            >
              {profileLoading ? "Saving..." : "Save Address"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
