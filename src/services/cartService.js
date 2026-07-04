import axios from "axios";
import { API_URL } from "./api";

export const fetchCartByUser = (userId) =>
  axios.get(`${API_URL}/carts?userId=${userId}`);

export const fetchCartItem = (userId, productId) =>
  axios.get(`${API_URL}/carts?userId=${userId}&productId=${productId}`);

export const addCartItem = (data) =>
  axios.post(`${API_URL}/carts`, data);

export const updateCartItem = (id, quantity) =>
  axios.patch(`${API_URL}/carts/${id}`, { quantity });

export const removeCartItem = (id) =>
  axios.delete(`${API_URL}/carts/${id}`);
