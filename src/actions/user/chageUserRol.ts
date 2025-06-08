"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (userId: string, role: string) => {
  const session = await auth();
  if (!session || session.user.role != "admin") {
    console.log("entre por aca");
    return {
      ok: false,
      message: "No hay sesion o bien el usuario no es administrador",
    };
  }
  try {
    const newRole = role === "admin" ? "admin" : "user";
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { role: newRole },
    });
    revalidatePath("/admin/users");

    return {
      ok: true,
      data:updatedUser
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "ocurrio un error en el update del rol",
    };
  }
};
