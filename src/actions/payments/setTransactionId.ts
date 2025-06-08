"use server";

import { prisma } from "@/lib/prisma";

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const order = await prisma.order.update({
      data: { transactionId: transactionId },
      where: { id: orderId },
    });
    if (!order) {
      return {
        ok: false,
        message: `order id inexistente ${orderId}`,
      };
    }
    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error al grabar el id de transaccion");
  }
};
