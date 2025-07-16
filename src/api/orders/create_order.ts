import { CartItem } from "@/interfaces";

interface Params {
  cart: CartItem[];
  phone: string;
  name: string;
}

export const createOrder = async ({
  cart, phone, name
}: Params) => {
  try {
    // Заглушка API - возвращаем фиктивные данные
    // В реальном приложении здесь будет запрос к API
    // const response = await fetch(`http://localhost:8080/orders`, {
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     cart,
    //     phone,
    //     name,
    //   }),
    // });
    // if (!response.ok) {
    //   throw new Error(`Ошибка HTTP: ${response.status}`);
    // }
    // const order = await response.json();

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));

    // Создаем фиктивный заказ
    const order = {
      id: `order-${Date.now()}`,
      status: "created",
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      customer: {
        name,
        phone
      },
      created_at: new Date().toISOString()
    };

    return order;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при создании заказа!");
  }
};
