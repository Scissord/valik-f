"use server";
// Импорт Prisma удален

export const getCountries = async () => {
  try {
    // Заглушка вместо работы с Prisma
    // Возвращаем фиктивный список стран
    const countries = [
      { id: "RU", name: "Россия" },
      { id: "US", name: "США" },
      { id: "ES", name: "Испания" },
      { id: "MX", name: "Мексика" },
      { id: "AR", name: "Аргентина" },
    ];

    return countries;
  } catch (error) {
    console.log(error) //Todo cambiar response ok: data:
    return [];
  }
};
