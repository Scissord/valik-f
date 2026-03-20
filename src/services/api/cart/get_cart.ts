import api from "../axios";

export const getCart = async (buyerId: number) => {
  const response = await api.get(`/sell/sell_product/${buyerId}/cart/`);
  return response.data;
};
