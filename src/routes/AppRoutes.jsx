import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// Protection
import ProtectedRoute from "../components/ProtectedRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Customer Pages
import Home from "../pages/customer/Home";
import ProductDetail from "../pages/customer/ProductDetail";
import Cart from "../pages/customer/Cart";
import Favorite from "../pages/customer/Favorite";
import Profile from "../pages/customer/Profile";
import OrderHistory from "../pages/customer/OrderHistory";
import Checkout from "../pages/customer/Checkout";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Customers from "../pages/admin/Customers";


function AppRoutes() {

  return (
    <Routes>

      {/* Customer & Guest Layout */}
      <Route element={<MainLayout />}>

        {/* Public Routes */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetail />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Customer Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />


        <Route
          path="/favorite"
          element={
            <ProtectedRoute role="customer">
              <Favorite />
            </ProtectedRoute>
          }
        />


        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="customer">
              <Checkout />
            </ProtectedRoute>
          }
        />


        <Route
          path="/orders"
          element={
            <ProtectedRoute role="customer">
              <OrderHistory />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute role="customer">
              <Profile />
            </ProtectedRoute>
          }
        />

      </Route>



      {/* Admin Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<Dashboard />}
        />


        <Route
          path="products"
          element={<Products />}
        />


        <Route
          path="orders"
          element={<Orders />}
        />


        <Route
          path="customers"
          element={<Customers />}
        />

      </Route>



      {/* Route không tồn tại */}
      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>
  );

}


export default AppRoutes;