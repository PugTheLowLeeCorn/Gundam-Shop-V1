import axios from "axios";

const API_URL = "http://localhost:8000/products";

export function useProducts() {

  const getAllProducts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
  };


  const getProductById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  };


  const createProduct = async (product) => {

    const newProduct = {
      ...product,
      image: `/images/${product.image}`
    };

    const response = await axios.post(
      API_URL,
      newProduct
    );

    return response.data;
  };


  const updateProduct = async (id, product) => {

    const updatedProduct = {
      ...product,
      image: `/images/${product.image}`
    };

    const response = await axios.put(
      `${API_URL}/${id}`,
      updatedProduct
    );

    return response.data;
  };


  const deleteProduct = async (id) => {

    await axios.delete(
      `${API_URL}/${id}`
    );

  };


  return {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };
}