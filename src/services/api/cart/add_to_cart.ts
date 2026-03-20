import api from "../axios";

interface AddToCartParams {
  buyer: number;
  product_original: number;
  quantity: number;
}

export const addToCart = async (params: AddToCartParams) => {
  const response = await api.post('/sell/sell_product/add_to_cart/', params);
  return response.data;
};
