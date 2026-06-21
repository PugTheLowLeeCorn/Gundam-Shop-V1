import axios from "axios";

const API = "http://localhost:8000";


export function useFavorite() {


  const getFavorites = async (userId) => {


    const response = await axios.get(
      `${API}/favorites?userId=${userId}`
    );


    return response.data;


  };


  const getFavoriteDetail = async (userId) => {


    const favoriteRes = await axios.get(
      `${API}/favorites?userId=${userId}`
    );


    const productRes = await axios.get(
      `${API}/products`
    );


    return favoriteRes.data.map(item => {
      const product = productRes.data.find(
        p => p.id === item.productId
      );

      if (!product) return null;

      return {
        ...item,
        name: product.name,
        image: product.image,
        price: product.price,
        grade: product.grade
      };
    }).filter(Boolean);


  };


  const toggleFavorite = async (userId, productId) => {


    const check = await axios.get(
      `${API}/favorites?userId=${userId}&productId=${productId}`
    );


    if (check.data.length > 0) {


      await axios.delete(
        `${API}/favorites/${check.data[0].id}`
      );


    } else {


      await axios.post(
        `${API}/favorites`,
        {
          userId,
          productId
        }
      );


    }


  };


  return {
    getFavorites,
    getFavoriteDetail,
    toggleFavorite
  };


}