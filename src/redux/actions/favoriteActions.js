export const FETCH_FAVORITES_REQUEST = "FETCH_FAVORITES_REQUEST";
export const FETCH_FAVORITES_SUCCESS = "FETCH_FAVORITES_SUCCESS";
export const FETCH_FAVORITES_FAILURE = "FETCH_FAVORITES_FAILURE";

export const CHECK_FAVORITE_REQUEST = "CHECK_FAVORITE_REQUEST";
export const CHECK_FAVORITE_SUCCESS = "CHECK_FAVORITE_SUCCESS";
export const CHECK_FAVORITE_FAILURE = "CHECK_FAVORITE_FAILURE";

export const TOGGLE_FAVORITE_REQUEST = "TOGGLE_FAVORITE_REQUEST";
export const TOGGLE_FAVORITE_SUCCESS = "TOGGLE_FAVORITE_SUCCESS";
export const TOGGLE_FAVORITE_FAILURE = "TOGGLE_FAVORITE_FAILURE";

export const fetchFavoritesRequest = () => ({
  type: FETCH_FAVORITES_REQUEST,
});

export const checkFavoriteRequest = (productId) => ({
  type: CHECK_FAVORITE_REQUEST,
  payload: productId,
});

export const toggleFavoriteRequest = (productId) => ({
  type: TOGGLE_FAVORITE_REQUEST,
  payload: productId,
});
