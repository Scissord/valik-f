"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

//const session =await auth();
export const getOrderByID = async (orderId: string) => {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Debe estar autenticado" };
  }

  const { id } = session.user;

  if (!orderId) return { ok: false, message: "No hay productID" };;

  const order = await prisma.order.findFirst({
    include: {
      OrderAddress: true,
      OrderItem: {
        include: {
          product: {
            include: {
              ProductImage: {
                take: 1,
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      id: orderId,
      userId:id
    }
  });

  return !order ? { ok: false, order: null } : { ok: true, order: order };
};
