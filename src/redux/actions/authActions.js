export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT = "LOGOUT";

export const REGISTER_REQUEST = "REGISTER_REQUEST";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

export const FETCH_CUSTOMERS_REQUEST = "FETCH_CUSTOMERS_REQUEST";
export const FETCH_CUSTOMERS_SUCCESS = "FETCH_CUSTOMERS_SUCCESS";
export const FETCH_CUSTOMERS_FAILURE = "FETCH_CUSTOMERS_FAILURE";

export const DELETE_CUSTOMER_REQUEST = "DELETE_CUSTOMER_REQUEST";
export const DELETE_CUSTOMER_SUCCESS = "DELETE_CUSTOMER_SUCCESS";
export const DELETE_CUSTOMER_FAILURE = "DELETE_CUSTOMER_FAILURE";

export const UPDATE_PROFILE_REQUEST = "UPDATE_PROFILE_REQUEST";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";

export const loginRequest = (credentials) => ({
  type: LOGIN_REQUEST,
  payload: credentials,
});

export const logout = () => ({ type: LOGOUT });

export const registerRequest = (userData) => ({
  type: REGISTER_REQUEST,
  payload: userData,
});

export const fetchCustomersRequest = () => ({
  type: FETCH_CUSTOMERS_REQUEST,
});

export const deleteCustomerRequest = (id) => ({
  type: DELETE_CUSTOMER_REQUEST,
  payload: id,
});

export const updateProfileRequest = (profileData) => ({
  type: UPDATE_PROFILE_REQUEST,
  payload: profileData,
});
