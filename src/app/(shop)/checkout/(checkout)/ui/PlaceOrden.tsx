import { placeOrder } from "@/actions";
import { useAddresStore, useCartStore } from "@/store";
import { currencyFormat } from "@/util";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const PlaceOrden = () => {
  const router=useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setloaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const address = useAddresStore((state) => state.address);
  const clearCart=useCartStore((state)=>state.clearCart)

//TODO cuando le das click hay un bug - Application error: a client-side exception has occurred while loading localhost (see the browser console for more information).
  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const resp=await placeOrder(productsToOrder,address);
    if(!resp.ok){
      setIsPlacingOrder(false);
      setErrorMessage(resp.message??"");
    }
    clearCart();
    router.replace("/orders/"+resp.order?.id)
  };

  useEffect(() => {
    setloaded(true);
  }, []);

  const { subTotal, tax, total, itemsInCart } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  );


  if (!loaded) {
    return <p>Cargando...</p>;
  }
  return (
    <div className="bg-white rounded-xl shadow-xl p-7 ">
      <h2 className="text-2xl mb-2 font-semibold"> Dirección de entrega:</h2>
      <div className="mb-4 mt-2">
        <p>
          Destinatario: {address.firstName} {address.lastName}
        </p>
        <p>Dirección: {address.address}</p>
        <p>
          Ciudad: {address.city} - {address.country}
        </p>
        <p>CP : {address.postalCode}</p>
        <p>Telefono : {address.phone}</p>
      </div>
      <div className="w-full bg-slate-300 h-0.5 rounded" />
      <h2 className="text-2xl mt-4 mb-2 font-semibold">
        Сводка заказа
      </h2>
      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className=" text-right">
          {itemsInCart == 1 ? "1 Artículo" : `${itemsInCart} Artículos`}
        </span>
        <span>Sub total</span>
        <span className=" text-right"> {currencyFormat(subTotal)}</span>
        <span>Impuesto (15%)</span>
        <span className=" text-right"> {currencyFormat(tax)}</span>
        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">
          {" "}
          {currencyFormat(total)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          <span className="text-xs">
            {" "}
            Al hacer click &quot;Colocar orden&quot;, aceptas nuestros{" "}
            <Link href="#" className="underline">
              términos y condiciones
            </Link>{" "}
            y{" "}
            <Link href="#" className="underline">
              política de privacidad
            </Link>
          </span>
        </p>
        <span>{errorMessage}</span>
        <button
          onClick={onPlaceOrder}
          className={clsx({
            "flex btn-primary justify-center cursor-pointer": !isPlacingOrder,
            "flex btn-disabled justify-center cursor-pointer": isPlacingOrder,
          })} //href={"/orders/123"}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
