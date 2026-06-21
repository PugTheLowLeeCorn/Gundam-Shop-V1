import axios from "axios";

const API = "http://localhost:8000";

export function useOrders() {
  const getOrdersByUser = async (userId) => {
    const response = await axios.get(`${API}/orders?userId=${userId}`);
    return response.data;
  };

  const getOrderDetail = async (userId) => {
    const orderRes = await axios.get(`${API}/orders?userId=${userId}`);
    const itemRes = await axios.get(`${API}/orderItems`);
    const productRes = await axios.get(`${API}/products`);

    return orderRes.data.map((order) => {
      const items = itemRes.data
        .filter((item) => item.orderId === order.id)
        .map((item) => {
          const product = productRes.data.find((p) => p.id === item.productId);
          if (!product) return null;

          return {
            ...item,
            name: product.name,
            image: product.image,
          };
        })
        .filter(Boolean);

      return { ...order, items };
    });
  };

  const createOrder = async (userId, cartItems, products, customerInfo) => {
    if (!cartItems.length) {
      throw new Error("Your cart is empty");
    }

    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error("One or more products in your cart are no longer available");
      }

      if (product.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Only ${product.quantity} available.`
        );
      }
    }

    let total = 0;
    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      total += product.price * item.quantity;
    });

    const orderRes = await axios.post(`${API}/orders`, {
      userId,
      customerInfo,
      total,
      paymentMethod: "COD",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    const orderId = orderRes.data.id;

    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);

      await axios.post(`${API}/orderItems`, {
        orderId,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      const newQuantity = Math.max(0, product.quantity - item.quantity);
      await axios.patch(`${API}/products/${product.id}`, {
        quantity: newQuantity,
      });

      await axios.delete(`${API}/carts/${item.id}`);
    }

    return orderRes.data;
  };

  return {
    getOrdersByUser,
    getOrderDetail,
    createOrder,
  };
}
