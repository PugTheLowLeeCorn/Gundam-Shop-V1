import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import authReducer from "./reducers/authReducer";
import productReducer from "./reducers/productReducer";
import cartReducer from "./reducers/cartReducer";
import favoriteReducer from "./reducers/favoriteReducer";
import orderReducer from "./reducers/orderReducer";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    favorite: favoriteReducer,
    order: orderReducer,
  }),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;
