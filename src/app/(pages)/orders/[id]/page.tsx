import Image from "next/image";
import { PayPalButton, Title } from "@/components";
import { getOrderByID } from "@/actions";
import { currencyFormat } from "@/util";
import { redirect } from "next/navigation";
import { EstadoOrden } from "../ui/EstadoOrden";

type Params = Promise<{ id: string }>
export default async function OrderPerIdPage(props: {params: Params}) {
  const params = await props.params
  const { id } = await params;
  const { ok, order,message} = await getOrderByID(id);

  if (!ok || !order) {
    console.log(message)
    redirect("/");
  }

  const productQuantity = order?.OrderItem.reduce(
    (count: number, product: { quantity: number }) => count + product.quantity,
    0
  );

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split("-").at(-1)}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <EstadoOrden isPaid={order?.isPaid} />
            {/* items */}
            {order?.OrderItem.map((product) => (
              <div key={product.product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                  alt={product.product.title}
                  className="mr-5 rodunded-none"
                />

                <div>
                  <p>
                    {product.size} - {product.product.title}
                  </p>
                  <p>
                    {currencyFormat(product.price)} x {product.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(product.price * product.quantity)}
                  </p>
                </div>
              </div>
            ))}{" "}
          </div>
          <div className="bg-white rounded-xl shadow-xl p-7 ">
            <h2 className="text-2xl mb-2 font-semibold">
              {" "}
              Dirección de entrega:
            </h2>
            <div className="mb-4 mt-2">
              <p>
                Destinatario: {order?.OrderAddress?.firstName}{" "}
                {order?.OrderAddress?.lastName}
              </p>
              <p>Dirección: {order?.OrderAddress?.address}</p>
              {order?.OrderAddress?.address2 && (
                <p>Dirección 2: {order.OrderAddress.address2}</p>
              )}
              <p>Ciudad: {order?.OrderAddress?.city}</p>
              <p>Localidad: Malvinas argentinas</p>
              <p>CP : {order?.OrderAddress?.postalCode}</p>
            </div>
            <div className="w-full bg-slate-300 h-0.5 rounded" />
            <h2 className="text-2xl mt-4 mb-2 font-semibold">
              {" "}
              Сводка заказа:
            </h2>
            <div className="grid grid-cols-2 ">
              <span>No. Productos</span>
              <span className=" text-right">
                {" "}
                {productQuantity == 1
                  ? "1 Artículo"
                  : `${productQuantity} Artículos`}
              </span>
              <span>Sub total</span>
              <span className=" text-right">
                {currencyFormat(order?.subTotal)}
              </span>
              <span>Impuesto (15%)</span>
              <span className=" text-right">{currencyFormat(order?.taxt)}</span>
              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">
                {currencyFormat(order?.total)}
              </span>
            </div>

            <div className="mt-10 mb-2 ">
              {!order?.isPaid ? (
                <PayPalButton orderId={order!.id} amount={order!.total} />
              ) : (
                <EstadoOrden isPaid={order?.isPaid} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
