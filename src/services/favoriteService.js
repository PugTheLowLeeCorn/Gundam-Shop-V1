import axios from "axios";
import { API_URL } from "./api";

export const fetchFavoritesByUser = (userId) =>
  axios.get(`${API_URL}/favorites?userId=${userId}`);

export const fetchFavoriteItem = (userId, productId) =>
  axios.get(`${API_URL}/favorites?userId=${userId}&productId=${productId}`);

export const addFavorite = (data) =>
  axios.post(`${API_URL}/favorites`, data);

export const removeFavorite = (id) =>
  axios.delete(`${API_URL}/favorites/${id}`);
