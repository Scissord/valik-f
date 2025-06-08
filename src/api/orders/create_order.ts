import { ProductItem } from "@/interfaces";

interface Params {
  cart: ProductItem[];
  phone: string;
  name: string;
}

export const createOrder = async ({
  cart, phone, name
}: Params) => {
  try {
    const response = await fetch(`http://localhost:8080/orders`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
        phone,
        name,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const order = await response.json();
    return order;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при создании заказа!");
  }
};
