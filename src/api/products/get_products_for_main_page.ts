interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const getProductsForMainPage = async ({
  page = 1,
  limit = 9,
}: PaginationOptions) => {
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || page < 1) limit = 9;

  try {
    // TODO LIMIT OFFSET
    const response = await fetch(`http://localhost:8080/products/main?limit=${limit}&page=${page}`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const {
      products,
      total,
      totalPages
    } = await response.json();

    return {
      products,
      total,
      totalPages
    };
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении списка категорий!");
  }
};
