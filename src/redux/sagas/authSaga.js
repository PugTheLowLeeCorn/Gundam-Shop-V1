import { call, put, takeLatest, select } from "redux-saga/effects";
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
import * as authService from "../../services/authService";
import { requireAdmin, requireCustomer } from "../utils/permissions";
import { saveShippingAddress } from "../../utils/shippingAddress";

const selectUser = (state) => state.auth.user;

function* loginSaga(action) {
  try {
    const { username, password } = action.payload;
    const response = yield call(authService.loginUser, username, password);

    if (response.data.length === 0) {
      throw new Error("Username hoặc password không đúng");
    }

    const currentUser = response.data[0];
    const userData = {
      id: currentUser.id,
      username: currentUser.username,
      fullname: currentUser.fullname,
      role: currentUser.role,
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      shippingAddress: currentUser.shippingAddress || null,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.shippingAddress) {
      saveShippingAddress(userData.id, userData.shippingAddress);
    }
    yield put({ type: LOGIN_SUCCESS, payload: userData });
  } catch (error) {
    yield put({
      type: LOGIN_FAILURE,
      payload: error.message || "Login failed",
    });
  }
}

function* logoutSaga() {
  yield call(() => localStorage.removeItem("user"));
}

function* registerSaga(action) {
  try {
    const { username, email, password, confirmPassword, fullname } = action.payload;

    if (!username?.trim()) throw new Error("Username is required");
    if (!email?.trim()) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (!confirmPassword) throw new Error("Confirm password is required");
    if (password !== confirmPassword) throw new Error("Passwords do not match");

    const usernameCheck = yield call(authService.checkUsernameExists, username);
    if (usernameCheck.data.length > 0) {
      throw new Error("Username đã tồn tại");
    }

    const emailCheck = yield call(authService.checkEmailExists, email);
    if (emailCheck.data.length > 0) {
      throw new Error("Email đã tồn tại");
    }

    yield call(authService.registerUser, { username, email, password, fullname });
    yield put({ type: REGISTER_SUCCESS });
  } catch (error) {
    yield put({
      type: REGISTER_FAILURE,
      payload: error.message || "Registration failed",
    });
  }
}

function* fetchCustomersSaga() {
  try {
    const user = yield select(selectUser);
    requireAdmin(user);

    const response = yield call(authService.fetchCustomers);
    yield put({ type: FETCH_CUSTOMERS_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({
      type: FETCH_CUSTOMERS_FAILURE,
      payload: error.message || "Failed to fetch customers",
    });
  }
}

function* deleteCustomerSaga(action) {
  try {
    const user = yield select(selectUser);
    requireAdmin(user);

    yield call(authService.deleteCustomer, action.payload);
    yield put({ type: DELETE_CUSTOMER_SUCCESS, payload: action.payload });
  } catch (error) {
    yield put({
      type: DELETE_CUSTOMER_FAILURE,
      payload: error.message || "Failed to delete customer",
    });
  }
}

function* updateProfileSaga(action) {
  try {
    const user = yield select(selectUser);
    requireCustomer(user);

    const response = yield call(
      authService.updateUser,
      user.id,
      action.payload
    );

    const updatedUser = {
      id: response.data.id,
      username: response.data.username,
      fullname: response.data.fullname,
      role: response.data.role,
      email: response.data.email || "",
      phone: response.data.phone || "",
      shippingAddress: response.data.shippingAddress || null,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    if (updatedUser.shippingAddress) {
      saveShippingAddress(updatedUser.id, updatedUser.shippingAddress);
    }

    yield put({ type: UPDATE_PROFILE_SUCCESS, payload: updatedUser });
  } catch (error) {
    yield put({
      type: UPDATE_PROFILE_FAILURE,
      payload: error.message || "Failed to update profile",
    });
  }
}

export default function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(REGISTER_REQUEST, registerSaga);
  yield takeLatest(FETCH_CUSTOMERS_REQUEST, fetchCustomersSaga);
  yield takeLatest(DELETE_CUSTOMER_REQUEST, deleteCustomerSaga);
  yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileSaga);
}
