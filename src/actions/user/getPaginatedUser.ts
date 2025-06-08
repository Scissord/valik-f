"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getPaginatedUsers = async () => {
  const session = await auth();
  if (!session || session.user.role != "admin") {
    return {
      ok: false,
      message: "No hay sesion o bien el usuario no es administrador",
    };
  }

  const usuarios = await prisma.user.findMany({
    orderBy: {
      name: "desc",
    },
  });
  return { ok: true, users: usuarios };
};
