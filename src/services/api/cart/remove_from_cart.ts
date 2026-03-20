import api from "../axios";

export const removeFromCart = async (id: number) => {
  const response = await api.delete(`/sell/sell_product/delete/${id}/`);
  return response.data;
};
