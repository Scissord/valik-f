'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { IoCloseOutline, IoCheckmarkCircle, IoWarningOutline, IoRemoveOutline, IoAddOutline } from 'react-icons/io5';
import { FaTelegram } from 'react-icons/fa';
import { useCartStore, useUserStore, createOrder, currencyFormat, CartItem } from '@/lib/legacy';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const { cart, clearCart, updateProductQuantity } = useCartStore();
  const { user } = useUserStore();

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((count, item) => count + item.quantity, 0);

  const handleOrderSubmit = async () => {
    if (!user) {
      setError('Необходимо авторизоваться для оформления заказа');
      return;
    }

    if (cart.length === 0) {
      setError('Корзина пуста');
      return;
    }

    if (!address.trim()) {
      setError('Укажите адрес доставки');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const groupedCart = cart.reduce<CartItem[]>((acc, item) => {
        const existingItem = acc.find(i => i.id === item.id && i.articul === item.articul);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);

      const order = await createOrder({
        cart: groupedCart,
        address: address.trim(),
        additional_info: additionalInfo.trim() || undefined
      });

      if (order) {
        setOrderSuccess(true);
        clearCart();
        setTimeout(() => {
          onClose();
          setOrderSuccess(false);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Ошибка при создании заказа:', err);
      setError(err.response?.data?.message || 'Произошла ошибка при оформлении заказа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setError(null);
      setOrderSuccess(false);
      setAddress('');
      setAdditionalInfo('');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 2147483647
      }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Оформление заказа
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <IoCloseOutline className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {orderSuccess ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoCheckmarkCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Заказ оформлен!
              </h3>
              <p className="text-gray-500 mb-4">
                Мы свяжемся с вами в ближайшее время
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <FaTelegram className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-blue-600">Уведомление отправлено</span>
              </div>
            </div>
          ) : (
            <>
              {/* Auth Warning */}
              {!user && (
                <div className="bg-red-50 rounded-xl p-4 mb-5 flex items-center gap-3">
                  <IoWarningOutline className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">
                    Войдите в аккаунт для оформления заказа
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Товары ({totalItems})</h3>
                <div className="space-y-3 max-h-52 overflow-y-auto">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.images?.[0] || "/imgs/placeholder.png"}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-sm text-gray-500">{currencyFormat(item.price)}</p>
                      </div>
                      <div className="flex items-center bg-white rounded-lg border border-gray-200">
                        <button
                          onClick={() => updateProductQuantity(item, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-orange-500"
                          disabled={item.quantity <= 1}
                        >
                          <IoRemoveOutline className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateProductQuantity(item, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-orange-500"
                        >
                          <IoAddOutline className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Form */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Доставка</h3>
                <div className="space-y-3">
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Адрес доставки *"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
                    rows={2}
                    required
                  />
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Комментарий к заказу (необязательно)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
                    rows={2}
                  />
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                  <span>Товаров</span>
                  <span>{totalItems} шт.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Итого</span>
                  <span className="text-lg font-bold text-gray-900">{currencyFormat(totalAmount)}</span>
                </div>
              </div>

              {/* Telegram Info */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl mb-5">
                <FaTelegram className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Заказ будет отправлен в Telegram для подтверждения
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl mb-5">
                  <IoWarningOutline className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        {!orderSuccess && (
          <div className="p-5 border-t border-gray-100">
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleOrderSubmit}
                disabled={isLoading || !user || cart.length === 0 || !address.trim()}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Оформляем...</span>
                  </div>
                ) : (
                  'Подтвердить'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
