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

const initialState = {
  customerOrders: [],
  adminOrders: [],
  dashboardStats: {
    products: 0,
    customers: 0,
    orders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
  },
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  createSuccess: false,
  statsLoading: false,
  statsError: null,
  updateLoading: false,
};

export default function orderReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CUSTOMER_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_CUSTOMER_ORDERS_SUCCESS:
      return { ...state, loading: false, customerOrders: action.payload };

    case FETCH_CUSTOMER_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_ADMIN_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_ADMIN_ORDERS_SUCCESS:
      return { ...state, loading: false, adminOrders: action.payload };

    case FETCH_ADMIN_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        createLoading: true,
        createError: null,
        createSuccess: false,
      };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        createLoading: false,
        createSuccess: true,
      };

    case CREATE_ORDER_FAILURE:
      return {
        ...state,
        createLoading: false,
        createError: action.payload,
        createSuccess: false,
      };

    case UPDATE_ORDER_STATUS_REQUEST:
      return { ...state, updateLoading: true };

    case UPDATE_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        adminOrders: action.payload,
      };

    case UPDATE_ORDER_STATUS_FAILURE:
      return { ...state, updateLoading: false, error: action.payload };

    case FETCH_DASHBOARD_STATS_REQUEST:
      return { ...state, statsLoading: true, statsError: null };

    case FETCH_DASHBOARD_STATS_SUCCESS:
      return {
        ...state,
        statsLoading: false,
        dashboardStats: action.payload,
      };

    case FETCH_DASHBOARD_STATS_FAILURE:
      return { ...state, statsLoading: false, statsError: action.payload };

    case "RESET_CREATE_ORDER":
      return { ...state, createSuccess: false, createError: null };

    default:
      return state;
  }
}
