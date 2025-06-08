"use client";
import type{ CartItem, ProductItem, Sizes } from "@/interfaces";
import { StockLabel } from "../stockLabel/StockLabel";
import { titleFont } from "@/config/fonts";
import { QuantitySelector, SizeSelector } from "@/components";
import { useState } from "react";
import { useCartStore } from "@/store";

export const AddToCart = ({ product }: { product: ProductItem }) => {
const addProductToCart = useCartStore((state) => state.addProductToCart)
  const [quantity, setQuantity] = useState<number>(1);

  const addToCart = () => {
    const cartProduct: CartItem = {
      ...product,
      quantity: quantity,
    }
    addProductToCart(cartProduct);
    cleanWindow();
  };

  const cleanWindow = () => {
    setQuantity(1);
  };

  return (
    <>
      {/* <StockLabel slug={product.slug} /> */}
      <h1 className={`${titleFont.className} text-2xl font-bold`}>
        {product.title}
      </h1>
      <p className="text-lg mb-5">$ {product?.price.toFixed(2)}</p>
      {/* <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        setSize={setSize}
      />
      <QuantitySelector onQuantityUpdated={setQuantity} quantity={quantity} /> */}
      <button onClick={addToCart} className="btn-primary my-5">
        Добавить в корзину
      </button>
    </>
  );
};
