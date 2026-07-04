export const FETCH_PRODUCTS_REQUEST = "FETCH_PRODUCTS_REQUEST";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";

export const FETCH_PRODUCT_BY_ID_REQUEST = "FETCH_PRODUCT_BY_ID_REQUEST";
export const FETCH_PRODUCT_BY_ID_SUCCESS = "FETCH_PRODUCT_BY_ID_SUCCESS";
export const FETCH_PRODUCT_BY_ID_FAILURE = "FETCH_PRODUCT_BY_ID_FAILURE";

export const CREATE_PRODUCT_REQUEST = "CREATE_PRODUCT_REQUEST";
export const CREATE_PRODUCT_SUCCESS = "CREATE_PRODUCT_SUCCESS";
export const CREATE_PRODUCT_FAILURE = "CREATE_PRODUCT_FAILURE";

export const UPDATE_PRODUCT_REQUEST = "UPDATE_PRODUCT_REQUEST";
export const UPDATE_PRODUCT_SUCCESS = "UPDATE_PRODUCT_SUCCESS";
export const UPDATE_PRODUCT_FAILURE = "UPDATE_PRODUCT_FAILURE";

export const DELETE_PRODUCT_REQUEST = "DELETE_PRODUCT_REQUEST";
export const DELETE_PRODUCT_SUCCESS = "DELETE_PRODUCT_SUCCESS";
export const DELETE_PRODUCT_FAILURE = "DELETE_PRODUCT_FAILURE";

export const fetchProductsRequest = () => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchProductByIdRequest = (id) => ({
  type: FETCH_PRODUCT_BY_ID_REQUEST,
  payload: id,
});

export const createProductRequest = (product) => ({
  type: CREATE_PRODUCT_REQUEST,
  payload: product,
});

export const updateProductRequest = (id, product) => ({
  type: UPDATE_PRODUCT_REQUEST,
  payload: { id, product },
});

export const deleteProductRequest = (id) => ({
  type: DELETE_PRODUCT_REQUEST,
  payload: id,
});
