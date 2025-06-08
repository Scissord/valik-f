"use server";

import { auth } from "@/auth";
import type { address, Sizes } from "@/interfaces";
import { prisma } from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Sizes;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: address
) => {
  try {
    //Obtengo la sesion del usuario
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        ok: false,
        message: "No hay session de usuario",
      };
    }

    //Busco productos en base al carrito
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds.map((p) => p.productId),
        },
      },
    });

    //Calculo los montos en base al monto de la base de datos
    const itemsInOrder = productIds.reduce(
      (count, product) => count + product.quantity,
      0
    );

    const { subTotal, tax, total } = productIds.reduce(
      (totals, items) => {
        const productQuantity = items.quantity;

        const product = products.find(
          (product) => product.id === items.productId
        );
        if (!product) throw new Error(`${items.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;
        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;
        return totals;
      },
      { subTotal: 0, tax: 0, total: 0 }
    );

    //Creo transaccion de base de datos
    const prismaTx = await prisma.$transaction(async (tx) => {
      //1. Actualizo el stock de productos
      const updatedStockProductsPromises = products.map(async (product) => {
        //Acumular valores
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }
        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });
      const updatedStockProducts = await Promise.all(
        updatedStockProductsPromises
      );
      //Verificar valores negativos = no hay stock
      updatedStockProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene inventario suficiente`);
        }
      });

      //2. Crear la orden - encabezado - detalle
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          taxt: tax,
          total: total,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });
      //3. Crear direccion de la orden
      /*const countryDetail=await prisma.country.findFirst({where:{
        countryId:
    }})*/
      const orderAddress = await tx.orderAddress.create({
        data: {
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          address2: address.address2 ?? "",
          postalCode: address.postalCode,
          phone: address.phone,
          city: address.city,
          countryId: address.country,
          orderId: order.id,
        },
      });

      return {
        updatedStockProducts: updatedStockProducts,
        order: order,
        orderAddress: orderAddress,
      };
    });
    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Ocurrió un error desconocido",
    };
  }
};
