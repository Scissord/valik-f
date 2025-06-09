interface Params {
  order_id: string;
}

// Временные данные для заглушки API
const mockOrders = [
  {
    id: "order-1234567890",
    status: "completed",
    items: [
      {
        id: "1",
        title: "Футболка базовая",
        price: 1999,
        quantity: 2,
        total: 3998
      }
    ],
    total: 3998,
    customer: {
      name: "Иван Иванов",
      phone: "+7 (999) 123-45-67"
    },
    created_at: "2023-09-15T10:30:00Z"
  },
  {
    id: "order-0987654321",
    status: "processing",
    items: [
      {
        id: "2",
        title: "Джинсы классические",
        price: 3999,
        quantity: 1,
        total: 3999
      },
      {
        id: "4",
        title: "Шапка зимняя",
        price: 1499,
        quantity: 1,
        total: 1499
      }
    ],
    total: 5498,
    customer: {
      name: "Петр Петров",
      phone: "+7 (999) 765-43-21"
    },
    created_at: "2023-09-20T15:45:00Z"
  }
];

export const findOrder = async ({
  order_id
}: Params) => {
  try {
    // Заглушка API - возвращаем фиктивные данные
    // В реальном приложении здесь будет запрос к API
    // const response = await fetch(`http://localhost:8080/orders/find`, {
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     order_id
    //   }),
    // });
    // if (!response.ok) {
    //   throw new Error(`Ошибка HTTP: ${response.status}`);
    // }
    // const order = await response.json();

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 200));

    // Поиск заказа по ID
    const order = mockOrders.find(o => o.id === order_id);
    
    if (!order) {
      throw new Error(`Заказ с ID ${order_id} не найден`);
    }

    return order;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при поиске заказа!");
  }
};
