"use client";
import type { CartItem, Product } from "@/lib/legacy";
import { useState } from "react";
import { useCartStore } from "@/lib/legacy";

export const AddToCart = ({ product }: { product: Product }) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart)
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addToCart = () => {
    setIsAddingToCart(true);

    const cartProduct: CartItem = {
      ...product,
      quantity: typeof quantity === 'number' && quantity > 0 ? quantity : 1
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

  const handleQuantityChange = (value: number | '') => {
    setQuantity(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center border border-slate-200 rounded-3xl bg-white w-28 h-10 overflow-hidden">
        <button
          className="px-3 h-full text-slate-500 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          onClick={() => typeof quantity === 'number' && quantity > 1 && handleQuantityChange(quantity - 1)}
          disabled={typeof quantity !== 'number' || quantity <= 1}
        >
          &minus;
        </button>
        <input
          type="text"
          inputMode="numeric"
          className="px-1 h-full text-center w-10 min-w-0 border-x border-slate-200 focus:outline-none font-semibold text-slate-800 text-base"
          value={typeof quantity === 'number' ? quantity.toLocaleString('ru-RU') : ''}
          onChange={(e) => {
            const val = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            if (val === '') {
              handleQuantityChange('');
            } else {
              const numValue = parseInt(val, 10);
              if (numValue <= 100000) {
                handleQuantityChange(numValue);
              } else {
                handleQuantityChange(100000);
              }
            }
          }}
          onBlur={() => {
            if (quantity === '' || quantity < 1) {
              handleQuantityChange(1);
            }
          }}
        />
        <button
          className="px-3 h-full text-slate-500 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          onClick={() => typeof quantity === 'number' && quantity < 100000 && handleQuantityChange(quantity + 1)}
          disabled={typeof quantity !== 'number' || quantity >= 100000}
        >
          +
        </button>
      </div>

      <button
        onClick={addToCart}
        disabled={isAddingToCart}
        className={`w-full h-12 rounded-full text-white font-medium transition-all flex items-center justify-center
          ${isAddingToCart
            ? 'bg-emerald-500 hover:bg-emerald-600 pointer-events-none'
            : 'bg-[#37383E] hover:bg-[#2b2c31] shadow-lg shadow-[#37383E]/20'}`}
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
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[15px] font-semibold">Добавить в корзину</span>
          </>
        )}
      </button>
    </div>
  );
};
