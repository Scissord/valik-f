'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';

import { CheckoutModal } from '@/components';
import { EmptyCartState } from '@/components/features/cart/EmptyCartState';
import { CartItemCard } from '@/components/features/cart/CartItemCard';
import { CartSummary } from '@/components/features/cart/CartSummary';
import { useCartStore } from '@/lib/legacy';
import api from "@/services/api/axios";

export default function CartPage() {
  const [loaded, setLoaded] = useState(false);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const { cart, updateProductQuantity, deleteProduct } = useCartStore(
    useShallow((state) => ({
      cart: state.cart,
      updateProductQuantity: state.updateProductQuantity,
      deleteProduct: state.deleteProduct
    }))
  );

  const summary = loaded ? {
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    count: cart.reduce((count, item) => count + item.quantity, 0)
  } : { total: 0, count: 0 };

  const updatePricesFromBackend = useCallback(async () => {
    if (isUpdatingPrices || cart.length === 0) return;

    setIsUpdatingPrices(true);
    try {
      const updatedCart = await Promise.all(
        cart.map(async (item) => {
          try {
            // ...


            const response = await api.get(`/products/${item.id}`);
            const productData = response.data;
            if (productData.price !== item.price) {
              return { ...item, price: productData.price };
            }
            return item;
          } catch (error) {
            console.error(`Ошибка при обновлении цены товара ${item.id}:`, error);
            return item;
          }
        })
      );

      updatedCart.forEach(item => {
        const originalItem = cart.find(cartItem => cartItem.id === item.id);
        if (originalItem && item.price !== originalItem.price) {
          updateProductQuantity(item, item.quantity);
        }
      });
    } catch (error) {
      console.error('Ошибка при обновлении цен:', error);
    } finally {
      setIsUpdatingPrices(false);
    }
  }, [cart, isUpdatingPrices, updateProductQuantity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded) {
      updatePricesFromBackend();
    }
  }, [loaded, updatePricesFromBackend]);

  // Loading state
  if (!loaded) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 py-16 flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Загрузка корзины...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-4 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Корзина</h1>
          <span className="text-sm text-gray-500">{summary.count} товаров</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Cart items */}
          <div className="lg:col-span-2">
            {cart.map((product) => (
              <CartItemCard
                key={`${product.id}-${product.added_at}`}
                product={product}
                updateProductQuantity={updateProductQuantity}
                deleteProduct={deleteProduct}
              />
            ))}

            {/* Continue shopping link */}
            <Link
              href="/products"
              className="inline-block mt-4 text-sm text-gray-500 hover:text-orange-500 transition-colors"
            >
              Продолжить покупки
            </Link>
          </div>

          {/* Right column - Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              count={summary.count}
              total={summary.total}
              onCheckout={() => setIsCheckoutModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
}
