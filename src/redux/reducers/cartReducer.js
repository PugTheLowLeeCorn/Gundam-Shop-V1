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

import { LOGOUT } from "../actions/authActions";
import { CREATE_ORDER_SUCCESS } from "../actions/orderActions";

const initialState = {
  data: [],
  count: 0,
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
};

function calcCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CART_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        count: calcCount(action.payload),
      };

    case FETCH_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_TO_CART_REQUEST:
    case UPDATE_CART_QUANTITY_REQUEST:
    case REMOVE_CART_ITEM_REQUEST:
      return { ...state, actionLoading: true, actionError: null };

    case ADD_TO_CART_SUCCESS:
    case UPDATE_CART_QUANTITY_SUCCESS:
    case REMOVE_CART_ITEM_SUCCESS:
      return {
        ...state,
        actionLoading: false,
        actionError: null,
        data: action.payload,
        count: calcCount(action.payload),
      };

    case ADD_TO_CART_FAILURE:
    case UPDATE_CART_QUANTITY_FAILURE:
    case REMOVE_CART_ITEM_FAILURE:
      return { ...state, actionLoading: false, actionError: action.payload };

    case CREATE_ORDER_SUCCESS:
    case LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
}
