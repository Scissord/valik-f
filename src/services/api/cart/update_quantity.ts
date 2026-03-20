import api from "../axios";

interface UpdateQuantityParams {
  quantity: number;
}

export const updateQuantity = async (id: number, params: UpdateQuantityParams) => {
  const response = await api.patch(`/sell/sell-product/${id}/quantity/`, params);
  return response.data;
};
