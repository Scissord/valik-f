"use client";
import { ProductImage } from "@/components";
import { Product } from "@/interfaces";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  product: Product;
}

export const ProductItem = ({ product }: Props) => {
  // Проверяем наличие массива изображений или создаем пустой массив
  const images = Array.isArray(product.images) ? product.images : [];
  const defaultImage = images.length > 0 ? images[0] : '/placeholder.jpg';
  
  const [displayImage, setDisplayImage] = useState(defaultImage);

  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.id}`}>
        <ProductImage
          url={displayImage}
          title={product.title}
          className="w-full object-cover rounded"
          width={500}
          height={500}
          onMouseEnter={() => images.length > 1 && setDisplayImage(images[1])}
          onMouseLeave={() => setDisplayImage(defaultImage)}
        />
      </Link>
      <div className="p-4 flex flex-col">
        <Link className="hover:text-blue-600" href={`/product/${product.id}`}>
          {product.title}
        </Link>
        <span className="font-bold">{typeof product.price === 'number' ? product.price.toLocaleString('ru-RU') : '0'} ₸</span>
      </div>
    </div>
  );
};
