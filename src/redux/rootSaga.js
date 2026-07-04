import { all } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import productSaga from "./sagas/productSaga";
import cartSaga from "./sagas/cartSaga";
import favoriteSaga from "./sagas/favoriteSaga";
import orderSaga from "./sagas/orderSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    productSaga(),
    cartSaga(),
    favoriteSaga(),
    orderSaga(),
  ]);
}
