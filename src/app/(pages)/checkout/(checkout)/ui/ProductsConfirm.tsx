"use client";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/util";
import Image from "next/image";
import { redirect } from "next/navigation";

export const ProductsConfirm = () => {
  const productInCart = useCartStore((state) => state.cart) || [];

  if (!productInCart) {
    return <p>Loading ... </p>;
  } else if (productInCart.length < 1) {
    redirect("/empty");
  }

  return (
    <>
      {productInCart
        .sort((a, b) => a.slug.localeCompare(b.slug))
        .map((product) => (
          <div key={`${product.slug}-${product.size}`} className="flex mb-5">
            <Image
              src={`/products/${product.images}`}
              width={100}
              height={100}
              style={{
                width: "100px",
                height: "100px",
              }}
              alt={product.title}
              className="mr-5 rodunded-none"
            />
            <div>
              {product.size} - {product.title} ({product.quantity})
              <p className="font-bold">
                {currencyFormat(product.price * product.quantity)}
              </p>
            </div>
          </div>
        ))}
    </>
  );
};
