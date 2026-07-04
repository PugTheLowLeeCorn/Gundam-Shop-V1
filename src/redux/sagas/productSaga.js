import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_BY_ID_REQUEST,
  FETCH_PRODUCT_BY_ID_SUCCESS,
  FETCH_PRODUCT_BY_ID_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
} from "../actions/productActions";
import { fetchProductsRequest } from "../actions/productActions";
import * as productService from "../../services/productService";
import { requireAdmin } from "../utils/permissions";

const selectUser = (state) => state.auth.user;

function* fetchProductsSaga() {
  try {
    const response = yield call(productService.fetchProducts);
    yield put({ type: FETCH_PRODUCTS_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({
      type: FETCH_PRODUCTS_FAILURE,
      payload: error.message || "Failed to fetch products",
    });
  }
}

function* fetchProductByIdSaga(action) {
  try {
    const response = yield call(productService.fetchProductById, action.payload);
    yield put({ type: FETCH_PRODUCT_BY_ID_SUCCESS, payload: response.data });
  } catch (error) {
    if (error.response?.status === 404) {
      yield put({ type: FETCH_PRODUCT_BY_ID_SUCCESS, payload: null });
      return;
    }
    yield put({
      type: FETCH_PRODUCT_BY_ID_FAILURE,
      payload: error.message || "Failed to fetch product",
    });
  }
}

function* createProductSaga(action) {
  try {
    const user = yield select(selectUser);
    requireAdmin(user);

    yield call(productService.createProduct, action.payload);
    yield put({ type: CREATE_PRODUCT_SUCCESS });
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put({
      type: CREATE_PRODUCT_FAILURE,
      payload: error.message || "Failed to create product",
    });
  }
}

function* updateProductSaga(action) {
  try {
    const user = yield select(selectUser);
    requireAdmin(user);

    const { id, product } = action.payload;
    yield call(productService.updateProduct, id, product);
    yield put({ type: UPDATE_PRODUCT_SUCCESS });
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put({
      type: UPDATE_PRODUCT_FAILURE,
      payload: error.message || "Failed to update product",
    });
  }
}

function* deleteProductSaga(action) {
  try {
    const user = yield select(selectUser);
    requireAdmin(user);

    yield call(productService.deleteProduct, action.payload);
    yield put({ type: DELETE_PRODUCT_SUCCESS });
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put({
      type: DELETE_PRODUCT_FAILURE,
      payload: error.message || "Failed to delete product",
    });
  }
}

export default function* productSaga() {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProductsSaga);
  yield takeLatest(FETCH_PRODUCT_BY_ID_REQUEST, fetchProductByIdSaga);
  yield takeLatest(CREATE_PRODUCT_REQUEST, createProductSaga);
  yield takeLatest(UPDATE_PRODUCT_REQUEST, updateProductSaga);
  yield takeLatest(DELETE_PRODUCT_REQUEST, deleteProductSaga);
}
