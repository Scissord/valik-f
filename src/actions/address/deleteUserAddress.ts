"use server"
import { prisma } from "@/lib/prisma";

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
    const deleteUser = await prisma.userAddress.deleteMany({
      where: {
        userId,
      },
    });

    return deleteUser;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "no se pudo grabar la dirección",
    };
  }
};
