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

const initialState = {
  data: [],
  currentProduct: null,
  loading: false,
  error: null,
  detailLoading: false,
  detailError: null,
  mutationLoading: false,
  mutationError: null,
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_PRODUCT_BY_ID_REQUEST:
      return {
        ...state,
        detailLoading: true,
        detailError: null,
        currentProduct: null,
      };

    case FETCH_PRODUCT_BY_ID_SUCCESS:
      return {
        ...state,
        detailLoading: false,
        currentProduct: action.payload,
      };

    case FETCH_PRODUCT_BY_ID_FAILURE:
      return {
        ...state,
        detailLoading: false,
        detailError: action.payload,
        currentProduct: null,
      };

    case CREATE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
    case DELETE_PRODUCT_REQUEST:
      return { ...state, mutationLoading: true, mutationError: null };

    case CREATE_PRODUCT_SUCCESS:
    case UPDATE_PRODUCT_SUCCESS:
    case DELETE_PRODUCT_SUCCESS:
      return { ...state, mutationLoading: false };

    case CREATE_PRODUCT_FAILURE:
    case UPDATE_PRODUCT_FAILURE:
    case DELETE_PRODUCT_FAILURE:
      return { ...state, mutationLoading: false, mutationError: action.payload };

    default:
      return state;
  }
}
