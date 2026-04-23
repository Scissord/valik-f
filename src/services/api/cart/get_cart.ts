import api from "../axios";

export const getCart = async () => {
  const response = await api.get('/sell/sell_product/cart/');
  return response.data;
};
