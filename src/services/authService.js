import axios from "axios";
import { API_URL } from "./api";

export const loginUser = (username, password) =>
  axios.get(`${API_URL}/users?username=${username}&password=${password}`);

export const checkUsernameExists = (username) =>
  axios.get(`${API_URL}/users?username=${username}`);

export const checkEmailExists = (email) =>
  axios.get(`${API_URL}/users?email=${email}`);

export const registerUser = (userData) =>
  axios.post(`${API_URL}/users`, { ...userData, role: "customer" });

export const fetchCustomers = () =>
  axios.get(`${API_URL}/users?role=customer`);

export const deleteCustomer = (id) =>
  axios.delete(`${API_URL}/users/${id}`);

export const updateUser = (id, userData) =>
  axios.patch(`${API_URL}/users/${id}`, userData);

export const fetchUserById = (id) => axios.get(`${API_URL}/users/${id}`);
