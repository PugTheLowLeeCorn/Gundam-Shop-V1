import axios from "axios";
import { API_URL } from "./api";

const PRODUCTS_URL = `${API_URL}/products`;

export const fetchProducts = () => axios.get(PRODUCTS_URL);

export const fetchProductById = (id) => axios.get(`${PRODUCTS_URL}/${id}`);

export const createProduct = (product) => {
  const newProduct = {
    ...product,
    image: product.image.startsWith("/images/")
      ? product.image
      : `/images/${product.image}`,
  };
  return axios.post(PRODUCTS_URL, newProduct);
};

export const updateProduct = (id, product) => {
  const updatedProduct = {
    ...product,
    image: product.image.startsWith("/images/")
      ? product.image
      : `/images/${product.image}`,
  };
  return axios.put(`${PRODUCTS_URL}/${id}`, updatedProduct);
};

export const deleteProduct = (id) => axios.delete(`${PRODUCTS_URL}/${id}`);

export const patchProductQuantity = (id, quantity) =>
  axios.patch(`${PRODUCTS_URL}/${id}`, { quantity });
