interface PaginationOptions {
  page?: number;
  limit?: number;
  category_id: number;
}

export const getProductsForCategory = async ({
  page = 1,
  limit = 9,
  category_id,
}: PaginationOptions) => {
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || page < 1) limit = 9;

  try {
    // TODO LIMIT OFFSET
    const response = await fetch(`http://localhost:8080/products/categories/${category_id}?limit=${limit}&page=${page}`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const {
      category,
      products,
      children_categories,
      total,
      totalPages
    } = await response.json();

    return {
      category,
      products,
      children_categories,
      total,
      totalPages
    };
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении списка категорий!");
  }
};
