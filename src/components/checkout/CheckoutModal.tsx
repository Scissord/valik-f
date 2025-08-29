'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose, IoCheckmarkCircle, IoWarning, IoCard, IoPersonOutline } from 'react-icons/io5';
import { FaTelegram } from 'react-icons/fa';
import { useCartStore, useUserStore } from '@/store';
import { createOrder } from '@/api/orders/create_order';
import { currencyFormat } from '@/util';
import { CartItem } from '@/interfaces';

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

  const { cart, clearCart } = useCartStore();
  const { user } = useUserStore();

  // Вычисляем итоговую сумму
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
      // Группируем товары по id и articul, суммируя количество
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
        // Автоматически закрываем модал через 3 секунды
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 2147483647
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] my-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <IoCard className="text-orange-600" />
            Оформление заказа
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <IoClose className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {orderSuccess ? (
            // Success State
            <div className="text-center py-8">
              <IoCheckmarkCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Заказ успешно оформлен!
              </h3>
              <p className="text-gray-600 mb-4">
                Информация о заказе отправлена в Telegram бот.
                Мы свяжемся с вами в ближайшее время.
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <FaTelegram className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-base font-medium text-blue-600">Уведомление отправлено в Telegram</span>
              </div>
            </div>
          ) : (
            <>
              {/* User Info */}
              {user ? (
                <div className="bg-orange-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <IoPersonOutline className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <IoWarning className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Требуется авторизация</p>
                      <p className="text-sm text-red-600">Войдите в аккаунт для оформления заказа</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Ваш заказ</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 bg-gray-50 rounded-lg p-2 w-12 h-12 flex items-center justify-center">
                        <img
                          src={item.images?.[0] || "/placeholder.jpg"}
                          alt={item.title}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {currencyFormat(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {currencyFormat(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Form */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Информация о доставке</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Адрес доставки *
                    </label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Укажите полный адрес доставки"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                      Дополнительная информация
                    </label>
                    <textarea
                      id="additionalInfo"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Комментарии к заказу"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Товаров:</span>
                  <span className="font-medium">{totalItems} шт.</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Итого:</span>
                  <span className="text-orange-600">{currencyFormat(totalAmount)}</span>
                </div>
              </div>

              {/* Telegram Info */}
              <div className="bg-orange-50 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <FaTelegram className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Оформление через Telegram
                    </p>
                    <p className="text-sm text-gray-600">
                      После подтверждения заказа вся информация будет отправлена в наш Telegram бот.
                      Мы свяжемся с вами для уточнения деталей доставки и оплаты.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <IoWarning className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

            </>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        {!orderSuccess && (
          <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl">
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleOrderSubmit}
                disabled={isLoading || !user || cart.length === 0 || !address.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Оформляем...
                  </div>
                ) : (
                  'Подтвердить заказ'
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
