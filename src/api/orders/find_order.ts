interface Params {
  order_id: string;
}

export const findOrder = async ({
  order_id
}: Params) => {
  try {
    const response = await fetch(`http://localhost:8080/orders/find`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const order = await response.json();

    return order;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении списка категорий!");
  }
};
