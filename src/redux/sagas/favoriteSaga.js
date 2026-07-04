import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  FETCH_FAVORITES_REQUEST,
  FETCH_FAVORITES_SUCCESS,
  FETCH_FAVORITES_FAILURE,
  CHECK_FAVORITE_REQUEST,
  CHECK_FAVORITE_SUCCESS,
  CHECK_FAVORITE_FAILURE,
  TOGGLE_FAVORITE_REQUEST,
  TOGGLE_FAVORITE_SUCCESS,
  TOGGLE_FAVORITE_FAILURE,
} from "../actions/favoriteActions";
import * as favoriteService from "../../services/favoriteService";
import * as productService from "../../services/productService";
import { requireCustomer } from "../utils/permissions";

const selectUser = (state) => state.auth.user;

function* buildFavoriteDetail(userId) {
  const favoriteRes = yield call(favoriteService.fetchFavoritesByUser, userId);
  const productRes = yield call(productService.fetchProducts);

  return favoriteRes.data
    .map((item) => {
      const product = productRes.data.find((p) => p.id === item.productId);
      if (!product) return null;

      return {
        ...item,
        name: product.name,
        image: product.image,
        price: product.price,
        grade: product.grade,
      };
    })
    .filter(Boolean);
}

function* fetchFavoritesSaga() {
  try {
    const user = yield select(selectUser);
    requireCustomer(user);

    const favorites = yield call(buildFavoriteDetail, user.id);
    yield put({ type: FETCH_FAVORITES_SUCCESS, payload: favorites });
  } catch (error) {
    yield put({
      type: FETCH_FAVORITES_FAILURE,
      payload: error.message || "Failed to fetch favorites",
    });
  }
}

function* checkFavoriteSaga(action) {
  try {
    const user = yield select(selectUser);
    if (!user || user.role !== "customer") {
      yield put({
        type: CHECK_FAVORITE_SUCCESS,
        payload: { productId: action.payload, isFavorite: false },
      });
      return;
    }

    const response = yield call(
      favoriteService.fetchFavoriteItem,
      user.id,
      action.payload
    );

    yield put({
      type: CHECK_FAVORITE_SUCCESS,
      payload: {
        productId: action.payload,
        isFavorite: response.data.length > 0,
      },
    });
  } catch {
    yield put({ type: CHECK_FAVORITE_FAILURE });
  }
}

function* toggleFavoriteSaga(action) {
  try {
    const user = yield select(selectUser);
    requireCustomer(user);

    const productId = action.payload;
    const check = yield call(favoriteService.fetchFavoriteItem, user.id, productId);

    if (check.data.length > 0) {
      yield call(favoriteService.removeFavorite, check.data[0].id);
    } else {
      yield call(favoriteService.addFavorite, { userId: user.id, productId });
    }

    const favorites = yield call(buildFavoriteDetail, user.id);
    const isFavorite = favorites.some((f) => f.productId === productId);

    yield put({
      type: TOGGLE_FAVORITE_SUCCESS,
      payload: { favorites, isFavorite },
    });
  } catch (error) {
    yield put({
      type: TOGGLE_FAVORITE_FAILURE,
      payload: error.message || "Failed to toggle favorite",
    });
  }
}

export default function* favoriteSaga() {
  yield takeLatest(FETCH_FAVORITES_REQUEST, fetchFavoritesSaga);
  yield takeLatest(CHECK_FAVORITE_REQUEST, checkFavoriteSaga);
  yield takeLatest(TOGGLE_FAVORITE_REQUEST, toggleFavoriteSaga);
}
