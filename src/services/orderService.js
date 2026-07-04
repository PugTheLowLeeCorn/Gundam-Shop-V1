import axios from "axios";
import { API_URL } from "./api";

export const fetchOrdersByUser = (userId) =>
  axios.get(`${API_URL}/orders?userId=${userId}`);

export const fetchAllOrders = () =>
  axios.get(`${API_URL}/orders`);

export const fetchOrderItems = () =>
  axios.get(`${API_URL}/orderItems`);

export const createOrder = (orderData) =>
  axios.post(`${API_URL}/orders`, orderData);

export const createOrderItem = (itemData) =>
  axios.post(`${API_URL}/orderItems`, itemData);

export const updateOrderStatus = (id, status) =>
  axios.patch(`${API_URL}/orders/${id}`, { status });
