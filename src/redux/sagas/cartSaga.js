import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  UPDATE_CART_QUANTITY_REQUEST,
  UPDATE_CART_QUANTITY_SUCCESS,
  UPDATE_CART_QUANTITY_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
} from "../actions/cartActions";
import * as cartService from "../../services/cartService";
import * as productService from "../../services/productService";
import { requireCustomer } from "../utils/permissions";

const selectUser = (state) => state.auth.user;

function* buildCartDetail(userId) {
  const cartRes = yield call(cartService.fetchCartByUser, userId);
  const productRes = yield call(productService.fetchProducts);

  return cartRes.data
    .map((item) => {
      const product = productRes.data.find((p) => p.id === item.productId);
      if (!product) return null;

      return {
        ...item,
        name: product.name,
        image: product.image,
        price: product.price,
        stock: product.quantity,
      };
    })
    .filter(Boolean);
}

function* fetchCartSaga() {
  try {
    const user = yield select(selectUser);
    requireCustomer(user);

    const cartDetail = yield call(buildCartDetail, user.id);
    yield put({ type: FETCH_CART_SUCCESS, payload: cartDetail });
  } catch (error) {
    yield put({
      type: FETCH_CART_FAILURE,
      payload: error.message || "Failed to fetch cart",
    });
  }
}

function* addToCartSaga(action) {
  try {
    const user = yield select(selectUser);
    requireCustomer(user);

    const productId = action.payload;
    const productRes = yield call(productService.fetchProductById, productId);
    const product = productRes.data;

    if (!product || product.quantity <= 0) {
      throw new Error("This product is out of stock");
    }

    const check = yield call(cartService.fetchCartItem, user.id, productId);

    if (check.data.length > 0) {
      const item = check.data[0];
      if (item.quantity >= product.quantity) {
        throw new Error(`Only ${product.quantity} units available in stock`);
      }
      yield call(cartService.updateCartItem, item.id, item.quantity + 1);
    } else {
      yield call(cartService.addCartItem, {
        userId: user.id,
        productId,
        quantity: 1,
      });
    }

    const cartDetail = yield call(buildCartDetail, user.id);
    yield put({ type: ADD_TO_CART_SUCCESS, payload: cartDetail });
  } catch (error) {
    yield put({
      type: ADD_TO_CART_FAILURE,
      payload: error.message || "Failed to add to cart",
    });
  }
}

function* updateCartQuantitySaga(action) {
  try {
    const user = yield select(selectUser);
    requireCustomer(user);

    const { id, quantity } = action.payload;
    yield call(cartService.updateCartItem, id, quantity);

    const cartDetail = yield call(buildCartDetail, user.id);
    yield put({ type: UPDATE_CART_QUANTITY_SUCCESS, payload: cartDetail });
  } catch (error) {
    yield put({
      type: UPDATE_CART_QUANTITY_FAILURE,
      payload: error.message || "Failed to update quantity",
    });
  }
}

function* removeCartItemSaga(action) {
  try {
    const user = yield select(selectUser);
    requireCustomer(user);

    yield call(cartService.removeCartItem, action.payload);

    const cartDetail = yield call(buildCartDetail, user.id);
    yield put({ type: REMOVE_CART_ITEM_SUCCESS, payload: cartDetail });
  } catch (error) {
    yield put({
      type: REMOVE_CART_ITEM_FAILURE,
      payload: error.message || "Failed to remove item",
    });
  }
}

export default function* cartSaga() {
  yield takeLatest(FETCH_CART_REQUEST, fetchCartSaga);
  yield takeLatest(ADD_TO_CART_REQUEST, addToCartSaga);
  yield takeLatest(UPDATE_CART_QUANTITY_REQUEST, updateCartQuantitySaga);
  yield takeLatest(REMOVE_CART_ITEM_REQUEST, removeCartItemSaga);
}
