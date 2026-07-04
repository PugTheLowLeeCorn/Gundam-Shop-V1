export const FETCH_CART_REQUEST = "FETCH_CART_REQUEST";
export const FETCH_CART_SUCCESS = "FETCH_CART_SUCCESS";
export const FETCH_CART_FAILURE = "FETCH_CART_FAILURE";

export const ADD_TO_CART_REQUEST = "ADD_TO_CART_REQUEST";
export const ADD_TO_CART_SUCCESS = "ADD_TO_CART_SUCCESS";
export const ADD_TO_CART_FAILURE = "ADD_TO_CART_FAILURE";

export const UPDATE_CART_QUANTITY_REQUEST = "UPDATE_CART_QUANTITY_REQUEST";
export const UPDATE_CART_QUANTITY_SUCCESS = "UPDATE_CART_QUANTITY_SUCCESS";
export const UPDATE_CART_QUANTITY_FAILURE = "UPDATE_CART_QUANTITY_FAILURE";

export const REMOVE_CART_ITEM_REQUEST = "REMOVE_CART_ITEM_REQUEST";
export const REMOVE_CART_ITEM_SUCCESS = "REMOVE_CART_ITEM_SUCCESS";
export const REMOVE_CART_ITEM_FAILURE = "REMOVE_CART_ITEM_FAILURE";

export const fetchCartRequest = () => ({
  type: FETCH_CART_REQUEST,
});

export const addToCartRequest = (productId) => ({
  type: ADD_TO_CART_REQUEST,
  payload: productId,
});

export const updateCartQuantityRequest = (id, quantity) => ({
  type: UPDATE_CART_QUANTITY_REQUEST,
  payload: { id, quantity },
});

export const removeCartItemRequest = (id) => ({
  type: REMOVE_CART_ITEM_REQUEST,
  payload: id,
});
