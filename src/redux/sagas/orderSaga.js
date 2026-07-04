import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  FETCH_CUSTOMER_ORDERS_REQUEST,
  FETCH_CUSTOMER_ORDERS_SUCCESS,
  FETCH_CUSTOMER_ORDERS_FAILURE,
  FETCH_ADMIN_ORDERS_REQUEST,
  FETCH_ADMIN_ORDERS_SUCCESS,
  FETCH_ADMIN_ORDERS_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  FETCH_DASHBOARD_STATS_REQUEST,
  FETCH_DASHBOARD_STATS_SUCCESS,
  FETCH_DASHBOARD_STATS_FAILURE,
} from "../actions/orderActions";
import * as orderService from "../../services/orderService";
import * as productService from "../../services/productService";
import * as authService from "../../services/authService";
import * as cartService from "../../services/cartService";
import { requireCustomer, requireAdmin } from "../utils/permissions";

const selectUser = (state) => state.auth.user;
const selectCartItems = (state) => state.cart.data;

function* buildOrderDetail(orders) {
  const itemRes = yield call(orderService.fetchOrderItems);
  const productRes = yield call(productService.fetchProducts);

  return orders.map((order) => {
    const items = itemRes.data
      .filter((item) => item.orderId === order.id)
      .map((item) => {
        const product = productRes.data.find((p) => p.id === item.productId);
        if (!product) return null;

        return {
          ...item,
          name: product.name,
          image: product.image,
        };
      })
      .filter(Boolean);

    return { ...order, items };
  });
}

function* fetchCustomerOrdersSaga() {
  try {
    const user = yield select(selectUser);
    requireCustomer(user);

    const response = yield call(orderService.fetchOrdersByUser, user.id);
    const orders = yield call(buildOrderDetail, response.data);
    yield put({ type: FETCH_CUSTOMER_ORDERS_SUCCESS, payload: orders });
  } catch (error) {
    yield put({
      type: FETCH_CUSTOMER_ORDERS_FAILURE,
      payload: error.message || "Failed to fetch orders",
    });
  }
}

function* fetchAdminOrdersSaga() {
  try {
    const user = yield select(selectUser);
    requireAdmin(user);

    const response = yield call(orderService.fetchAllOrders);
    yield put({
      type: FETCH_ADMIN_ORDERS_SUCCESS,
      payload: response.data.reverse(),
    });
  } catch (error) {
    yield put({
      type: FETCH_ADMIN_ORDERS_FAILURE,
      payload: error.message || "Failed to fetch orders",
    });
  }
}

function* createOrderSaga(action) {
  try {
    const user = yield select(selectUser);
    requireCustomer(user);

    const cartItems = yield select(selectCartItems);

    if (!cartItems.length) {
      throw new Error("Your cart is empty");
    }

    const productRes = yield call(productService.fetchProducts);
    const products = productRes.data;

    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error("One or more products in your cart are no longer available");
      }

      if (product.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Only ${product.quantity} available.`
        );
      }
    }

    let total = 0;
    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      total += product.price * item.quantity;
    });

    const orderRes = yield call(orderService.createOrder, {
      userId: user.id,
      customerInfo: action.payload,
      total,
      paymentMethod: "COD",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    const orderId = orderRes.data.id;

    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);

      yield call(orderService.createOrderItem, {
        orderId,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      const newQuantity = Math.max(0, product.quantity - item.quantity);
      yield call(productService.patchProductQuantity, product.id, newQuantity);
      yield call(cartService.removeCartItem, item.id);
    }

    yield put({ type: CREATE_ORDER_SUCCESS, payload: orderRes.data });
  } catch (error) {
    yield put({
      type: CREATE_ORDER_FAILURE,
      payload: error.message || "Failed to create order",
    });
  }
}

function* updateOrderStatusSaga(action) {
  try {
    const user = yield select(selectUser);
    requireAdmin(user);

    const { id, status } = action.payload;
    yield call(orderService.updateOrderStatus, id, status);

    const response = yield call(orderService.fetchAllOrders);
    yield put({
      type: UPDATE_ORDER_STATUS_SUCCESS,
      payload: response.data.reverse(),
    });
  } catch (error) {
    yield put({
      type: UPDATE_ORDER_STATUS_FAILURE,
      payload: error.message || "Failed to update order status",
    });
  }
}

function* fetchDashboardStatsSaga() {
  try {
    const user = yield select(selectUser);
    requireAdmin(user);

    const [productsRes, customersRes, ordersRes] = yield [
      call(productService.fetchProducts),
      call(authService.fetchCustomers),
      call(orderService.fetchAllOrders),
    ];

    const orders = ordersRes.data;
    const completedOrders = orders.filter((o) => o.status === "completed");
    const pendingOrders = orders.filter((o) => o.status === "pending");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    yield put({
      type: FETCH_DASHBOARD_STATS_SUCCESS,
      payload: {
        products: productsRes.data.length,
        customers: customersRes.data.length,
        orders: orders.length,
        totalRevenue,
        completedOrders: completedOrders.length,
        pendingOrders: pendingOrders.length,
      },
    });
  } catch (error) {
    yield put({
      type: FETCH_DASHBOARD_STATS_FAILURE,
      payload: error.message || "Failed to fetch dashboard stats",
    });
  }
}

export default function* orderSaga() {
  yield takeLatest(FETCH_CUSTOMER_ORDERS_REQUEST, fetchCustomerOrdersSaga);
  yield takeLatest(FETCH_ADMIN_ORDERS_REQUEST, fetchAdminOrdersSaga);
  yield takeLatest(CREATE_ORDER_REQUEST, createOrderSaga);
  yield takeLatest(UPDATE_ORDER_STATUS_REQUEST, updateOrderStatusSaga);
  yield takeLatest(FETCH_DASHBOARD_STATS_REQUEST, fetchDashboardStatsSaga);
}
