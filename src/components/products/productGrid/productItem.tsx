"use client";
import { ProductImage } from "@/components";
import { Product } from "@/interfaces";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  product: Product;
}

export const ProductItem = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);

  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.id}`}>
        <ProductImage
          url={displayImage}
          title={product.title}
          className="w-full object-cover rounded"
          width={500}
          height={500}
          onMouseEnter={() => product.images.length > 1 && setDisplayImage(product.images[1])}
          onMouseLeave={() => setDisplayImage(product.images[0])}
        />
      </Link>
      <div className="p-4 flex flex-col">
        <Link className="hover:text-blue-600" href={`/product/${product.id}`}>
          {product.title}
        </Link>
        <span className="font-bold">{product.price.toLocaleString('ru-RU')} ₸</span>
      </div>
    </div>
  );
};
