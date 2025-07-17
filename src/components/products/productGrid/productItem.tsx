"use client";
import { ProductImage } from "@/components";
import { Product } from "@/interfaces";
import Link from "next/link";
import React, { useState, memo, useEffect } from "react";

interface Props {
  product: Product;
}

export const ProductItem = memo(({ product }: Props) => {
  const defaultImage = product.images?.[0] ?? "/placeholder.jpg";
  const hoverImage = product.images?.[1] ?? defaultImage;

  const [displayImage, setDisplayImage] = useState(defaultImage);

  useEffect(() => {
    setDisplayImage(defaultImage);
  }, [defaultImage]);

  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.id}`}>
        <ProductImage
          url={displayImage}
          title={product.title}
          className="w-full object-cover rounded"
          width={500}
          height={500}
          onMouseEnter={() => setDisplayImage(hoverImage)}
          onMouseLeave={() => setDisplayImage(defaultImage)}
        />
      </Link>
      <div className="p-4 flex flex-col">
        <Link className="hover:text-blue-600" href={`/product/${product.id}`}>
          {product.title}
        </Link>
        <span className="font-bold">
          {typeof product.price === "number"
            ? product.price.toLocaleString("ru-RU")
            : "0"}{" "}
          ₸
        </span>
      </div>
    </div>
  );
});

ProductItem.displayName = "ProductItem";
