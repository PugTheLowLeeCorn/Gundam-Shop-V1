import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  FETCH_CUSTOMERS_REQUEST,
  FETCH_CUSTOMERS_SUCCESS,
  FETCH_CUSTOMERS_FAILURE,
  DELETE_CUSTOMER_REQUEST,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from "../actions/authActions";

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getSavedUser(),
  loading: false,
  error: null,
  registerLoading: false,
  registerError: null,
  registerSuccess: false,
  customers: [],
  customersLoading: false,
  customersError: null,
  profileLoading: false,
  profileError: null,
  profileSuccess: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };

    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case LOGOUT:
      return { ...state, user: null, error: null };

    case REGISTER_REQUEST:
      return {
        ...state,
        registerLoading: true,
        registerError: null,
        registerSuccess: false,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        registerLoading: false,
        registerSuccess: true,
        registerError: null,
      };

    case REGISTER_FAILURE:
      return {
        ...state,
        registerLoading: false,
        registerError: action.payload,
        registerSuccess: false,
      };

    case FETCH_CUSTOMERS_REQUEST:
      return { ...state, customersLoading: true, customersError: null };

    case FETCH_CUSTOMERS_SUCCESS:
      return {
        ...state,
        customersLoading: false,
        customers: action.payload,
      };

    case FETCH_CUSTOMERS_FAILURE:
      return {
        ...state,
        customersLoading: false,
        customersError: action.payload,
      };

    case DELETE_CUSTOMER_REQUEST:
      return { ...state, customersLoading: true };

    case DELETE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customersLoading: false,
        customers: state.customers.filter((c) => c.id !== action.payload),
      };

    case DELETE_CUSTOMER_FAILURE:
      return {
        ...state,
        customersLoading: false,
        customersError: action.payload,
      };

    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        profileLoading: true,
        profileError: null,
        profileSuccess: false,
      };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        profileLoading: false,
        profileSuccess: true,
        profileError: null,
        user: action.payload,
      };

    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        profileLoading: false,
        profileError: action.payload,
        profileSuccess: false,
      };

    default:
      return state;
  }
}
