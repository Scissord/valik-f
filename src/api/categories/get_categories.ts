export const getCategories = async () => {
  try {
    const response = await fetch('http://localhost:8080/categories');

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const categories = await response.json();

    return categories;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении списка категорий!");
  }
};
