import axios from "axios";

const API = "http://localhost:8000";

export function useCart() {
  const getCartByUser = async (userId) => {
    const response = await axios.get(`${API}/carts?userId=${userId}`);
    return response.data;
  };

  const getCartDetail = async (userId) => {
    const cartRes = await axios.get(`${API}/carts?userId=${userId}`);
    const productRes = await axios.get(`${API}/products`);

    return cartRes.data
      .map((item) => {
        const product = productRes.data.find((p) => p.id === item.productId);
        if (!product) return null;

        return {
          ...item,
          name: product.name,
          image: product.image,
          price: product.price,
          stock: product.quantity,
        };
      })
      .filter(Boolean);
  };

  const addToCart = async (userId, productId) => {
    const productRes = await axios.get(`${API}/products/${productId}`);
    const product = productRes.data;

    if (!product || product.quantity <= 0) {
      throw new Error("This product is out of stock");
    }

    const check = await axios.get(
      `${API}/carts?userId=${userId}&productId=${productId}`
    );

    if (check.data.length > 0) {
      const item = check.data[0];

      if (item.quantity >= product.quantity) {
        throw new Error(`Only ${product.quantity} units available in stock`);
      }

      await axios.patch(`${API}/carts/${item.id}`, {
        quantity: item.quantity + 1,
      });
    } else {
      await axios.post(`${API}/carts`, {
        userId,
        productId,
        quantity: 1,
      });
    }
  };

  const updateQuantity = async (id, quantity) => {
    await axios.patch(`${API}/carts/${id}`, { quantity });
  };

  const removeCartItem = async (id) => {
    await axios.delete(`${API}/carts/${id}`);
  };

  const clearCart = async (userId) => {
    const items = await getCartByUser(userId);
    for (const item of items) {
      await removeCartItem(item.id);
    }
  };

  return {
    getCartByUser,
    getCartDetail,
    addToCart,
    updateQuantity,
    removeCartItem,
    clearCart,
  };
}
