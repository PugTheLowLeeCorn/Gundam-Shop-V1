import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartRequest } from "../../redux/actions/cartActions";
import { createOrderRequest, resetCreateOrder } from "../../redux/actions/orderActions";
import { updateProfileRequest } from "../../redux/actions/authActions";
import ProductImage from "../../components/ProductImage";
import EmptyState from "../../components/EmptyState";
import ShippingAddressFields from "../../components/ShippingAddressFields";
import { formatPrice } from "../../utils/formatPrice";
import { validateEmail, validatePhone } from "../../utils/validation";
import {
  buildFullShippingAddress,
  emptyShippingAddress,
  resolveShippingAddress,
  saveShippingAddress,
} from "../../utils/shippingAddress";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const items = useSelector((state) => state.cart.data);
  const loading = useSelector((state) => state.cart.loading);
  const { createLoading, createError, createSuccess } = useSelector(
    (state) => state.order
  );

  const savedAddress = resolveShippingAddress(user);

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    note: "",
  });

  const [address, setAddress] = useState(() => ({
    ...emptyShippingAddress(),
    ...(savedAddress || {}),
  }));

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCartRequest());
    dispatch(resetCreateOrder());
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess) {
      navigate("/orders", { state: { orderSuccess: true } });
    }
  }, [createSuccess, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddressChange = (nextAddress) => {
    setAddress(nextAddress);
    setFieldErrors((prev) => ({
      ...prev,
      provinceCode: "",
      wardCode: "",
      streetAddress: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!form.fullname.trim()) errors.fullname = "Full name is required";
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      errors.email = "Invalid email format";
    }
    if (!form.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      errors.phone = "Invalid phone number";
    }
    if (!address.provinceCode) errors.provinceCode = "Province is required";
    if (!address.wardCode) errors.wardCode = "Ward is required";
    if (!address.streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullShippingAddress = buildFullShippingAddress(
      address.streetAddress,
      address.wardName,
      address.provinceName
    );

    const shippingAddress = {
      provinceCode: address.provinceCode,
      provinceName: address.provinceName,
      wardCode: address.wardCode,
      wardName: address.wardName,
      streetAddress: address.streetAddress.trim(),
      fullShippingAddress,
    };

    saveShippingAddress(user.id, shippingAddress);

    dispatch(
      updateProfileRequest({
        email: form.email.trim(),
        phone: form.phone.trim(),
        shippingAddress,
      })
    );

    dispatch(
      createOrderRequest({
        fullname: form.fullname.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        note: form.note.trim(),
        ...shippingAddress,
        address: fullShippingAddress,
      })
    );
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gundam-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gundam-dark py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <EmptyState
            icon="🛒"
            title="Nothing to checkout"
            description="Your cart is empty. Add some kits before proceeding to checkout."
            action={
              <Link to="/" className="btn-primary">
                Continue Shopping
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gundam-dark py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-display text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-gundam-muted mb-10">Complete your order with Cash on Delivery</p>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gundam-card border border-white/8 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold mb-6">Customer Information</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm text-gundam-muted mb-1.5 block">Full Name *</label>
                  <input
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    className="input-field !rounded-xl"
                    placeholder="Your full name"
                  />
                  {fieldErrors.fullname && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.fullname}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gundam-muted mb-1.5 block">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field !rounded-xl"
                    placeholder="your@email.com"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gundam-muted mb-1.5 block">Phone Number *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="input-field !rounded-xl"
                    placeholder="0912345678"
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                <ShippingAddressFields
                  value={address}
                  onChange={handleAddressChange}
                  errors={fieldErrors}
                />

                <div className="sm:col-span-2">
                  <label className="text-sm text-gundam-muted mb-1.5 block">Note (optional)</label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    className="input-field !rounded-xl min-h-[80px] resize-y"
                    placeholder="Delivery instructions..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-gundam-card border border-white/8 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold mb-6">Order Items</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain bg-gundam-surface rounded-lg p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-gundam-muted">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-gundam-accent">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gundam-card border border-white/8 rounded-2xl p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-6">Payment</h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gundam-muted">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gundam-muted">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-gundam-accent">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-gundam-accent/10 border border-gundam-accent/20">
                <p className="text-sm font-medium text-gundam-accent">Cash On Delivery (COD)</p>
                <p className="text-xs text-gundam-muted mt-1">Pay when you receive your kit</p>
              </div>

              {createError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {createError}
                </div>
              )}

              <button
                type="submit"
                disabled={createLoading}
                className="w-full btn-primary"
              >
                {createLoading ? "Placing Order..." : "Place Order (COD)"}
              </button>

              <Link
                to="/cart"
                className="block text-center text-sm text-gundam-muted hover:text-gundam-accent mt-4 transition-colors"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
