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

import { LOGOUT } from "../actions/authActions";

const initialState = {
  data: [],
  isFavorite: false,
  checkedProductId: null,
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
};

export default function favoriteReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FAVORITES_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_FAVORITES_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case FETCH_FAVORITES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CHECK_FAVORITE_REQUEST:
      return { ...state, checkedProductId: action.payload, isFavorite: false };

    case CHECK_FAVORITE_SUCCESS:
      return {
        ...state,
        isFavorite: action.payload.isFavorite,
        checkedProductId: action.payload.productId,
      };

    case CHECK_FAVORITE_FAILURE:
      return { ...state, isFavorite: false };

    case TOGGLE_FAVORITE_REQUEST:
      return { ...state, actionLoading: true, actionError: null };

    case TOGGLE_FAVORITE_SUCCESS:
      return {
        ...state,
        actionLoading: false,
        isFavorite: action.payload.isFavorite,
        data: action.payload.favorites,
      };

    case TOGGLE_FAVORITE_FAILURE:
      return { ...state, actionLoading: false, actionError: action.payload };

    case LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
}
