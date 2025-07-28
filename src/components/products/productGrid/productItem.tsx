"use client";
import { ProductImage } from "@/components";
import { Product } from "@/interfaces";
import Link from "next/link";
import React, { useState, memo, useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";
import { useCartStore } from "@/store";

interface Props {
  product: Product;
}

export const ProductItem = memo(({ product }: Props) => {
  const defaultImage = product.images?.[0] ?? "/placeholder.jpg";
  const hoverImage = product.images?.[1] ?? defaultImage;

  const [displayImage, setDisplayImage] = useState(defaultImage);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  useEffect(() => {
    setDisplayImage(defaultImage);
  }, [defaultImage]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    const cartProduct = {
      ...product,
      quantity: 1,
    };
    
    addProductToCart(cartProduct);
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
  };

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white relative"
    >
      <Link href={`/product/${product.id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden">
          <ProductImage
            url={displayImage}
            title={product.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            width={300}
            height={300}
            onMouseEnter={() => setDisplayImage(hoverImage)}
            onMouseLeave={() => setDisplayImage(defaultImage)}
          />
        </div>
      </Link>
      
      <div className="p-3">
        <div className="flex justify-between items-start">
          <Link 
            className="text-sm font-medium text-gray-800 hover:text-orange-500 transition-colors line-clamp-2 h-10" 
            href={`/product/${product.id}`}
          >
            {product.title}
          </Link>
        </div>
        
        <div className="mt-1 flex justify-between items-center">
          <span className="font-bold text-orange-600">
            {typeof product.price === "number"
              ? product.price.toLocaleString("ru-RU")
              : "0"}{" "}
            ₸
          </span>
          
          <button 
            onClick={handleAddToCart}
            className={`p-2 rounded-full transition-all duration-300
              ${
                isAddingToCart 
                  ? 'bg-green-500 text-white' 
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <IoCartOutline className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductItem.displayName = "ProductItem";
