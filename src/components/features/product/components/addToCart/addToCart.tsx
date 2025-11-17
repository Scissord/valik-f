"use client";
import type { CartItem, Product } from "@/lib/legacy";
import { useState } from "react";
import { useCartStore } from "@/lib/legacy";

export const AddToCart = ({ product }: { product: Product }) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart)
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addToCart = () => {
    setIsAddingToCart(true);
    
    const cartProduct: CartItem = {
      ...product,
      quantity: quantity,
      image: product.images?.[0]
    }
    
    addProductToCart(cartProduct);
    
    // Имитация задержки для анимации
    setTimeout(() => {
      setIsAddingToCart(false);
      cleanWindow();
    }, 500);
  };

  const cleanWindow = () => {
    setQuantity(1);
  };
  
  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 mb-2 font-medium">Количество</label>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button 
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => quantity > 1 && handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
            </button>
            <span className="px-4 py-2 text-center w-12">{quantity}</span>
            <button 
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-gray-700 mb-2 font-medium">Итого</label>
          <div className="text-xl font-bold text-orange-600">
            {(product.price * quantity).toLocaleString('ru-RU')} ₸
          </div>
        </div>
      </div>
      
      <button 
        onClick={addToCart} 
        disabled={isAddingToCart}
        className={`w-full py-3 px-6 rounded-md text-white font-medium transition-all flex items-center justify-center
          ${isAddingToCart 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200'}`}
      >
        {isAddingToCart ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Добавлено
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Добавить в корзину
          </>
        )}
      </button>
      
      <div className="flex items-center gap-2 justify-center text-sm text-gray-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Безопасная оплата
      </div>
    </div>
  );
};
