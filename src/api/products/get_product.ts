interface Params {
  id: string;
}

export const getProduct = async ({
  id,
}: Params) => {
  try {
    // TODO LIMIT OFFSET
    const response = await fetch(`http://localhost:8080/products/${id}`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const product = await response.json();

    return product;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении списка категорий!");
  }
};
