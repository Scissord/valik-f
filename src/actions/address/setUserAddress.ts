"use server";

import { address } from "@/interfaces";
// Импорт Prisma удален

export const setUserAddress = async (address: address, userId: string) => {
  try {
    // Заглушка вместо вызова Prisma
    return {
      ok: true,
      message: {
        id: '1',
        userId,
        address: address.address,
        address2: address.address2 ?? "",
        countryId: address.country,
        firstName: address.firstName.charAt(0).toUpperCase() + address.firstName.slice(1).toLowerCase(),
        lastName: address.lastName.charAt(0).toUpperCase() + address.lastName.slice(1).toLowerCase(),
        phone: address.phone,
        city: address.city,
        postalCode: address.postalCode,
      }
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "no se pudo grabar la dirección",
    };
  }
};

// Функция заменена на заглушку
const createOrReplaceAddress = async (address: address, userId: string) => {
  try {
    // Заглушка вместо работы с Prisma
    return {
      id: '1',
      userId,
      address: address.address,
      address2: address.address2 ?? "",
      countryId: address.country,
      firstName: address.firstName.charAt(0).toUpperCase() + address.firstName.slice(1).toLowerCase(),
      lastName: address.lastName.charAt(0).toUpperCase() + address.lastName.slice(1).toLowerCase(),
      phone: address.phone,
      city: address.city,
      postalCode: address.postalCode,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "no se pudo grabar la dirección",
    };
  }
};
