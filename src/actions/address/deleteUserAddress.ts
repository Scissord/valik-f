"use server"
// Импорт Prisma удален

export const deleteUserAddress = async (userId: string) => {
  try {
    await deleteUserAddressById(userId);
    return {
      ok: true,
      message: "ok",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "no se pudo grabar la dirección",
    };
  }
};

const deleteUserAddressById = async (userId: string) => {
  try {
    // Заглушка вместо работы с Prisma
    // Имитируем успешное удаление
    return {
      count: 1
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "no se pudo grabar la dirección",
    };
  }
};
