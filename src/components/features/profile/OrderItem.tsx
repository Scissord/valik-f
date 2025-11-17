"use client";

import { checkOrderStatus, IOrder } from "@/lib/legacy";
import { useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline, IoRefreshOutline } from "react-icons/io5";
import Image from "next/image";

interface OrderItemProps {
  order: IOrder;
}

export const OrderItem = ({ order: initialOrder }: OrderItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [order, setOrder] = useState<IOrder>(initialOrder);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      console.log("Запрос на обновление заказа:", order.id);
      const updatedOrder = await checkOrderStatus({ order_id: order.id });
      console.log("Получен ответ от сервера:", updatedOrder);

      if (updatedOrder && updatedOrder.items) {
        setOrder(updatedOrder);
      } else {
        console.error("Получен неполный ответ от сервера:", updatedOrder);
        // Если в ответе нет items, сохраняем текущие items
        setOrder(prev => ({
          ...(updatedOrder as IOrder),
          items: updatedOrder?.items || prev.items || []
        }));
      }
    } catch (error) {
      console.error("Ошибка при обновлении статуса заказа:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Создан";
      case 1:
        return "Принят";
      case 2:
        return "Отгружен";
      case 3:
        return "Доставлен";
      case 4:
        return "Отменен";
      case 5:
        return "Частичный возврат";
      case 6:
        return "Полный возврат";
      default:
        return "Неизвестен";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 1:
        return "bg-blue-100 text-blue-800";
      case 2:
        return "bg-purple-100 text-purple-800";
      case 3:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <p className="font-medium text-gray-800">
            Заказ №: {order.id}
          </p>
          <p className="text-sm text-gray-500">
            Дата: {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateStatus();
            }}
            disabled={isUpdating}
            className={`text-gray-500 hover:text-gray-700 ${isUpdating ? 'animate-spin' : ''}`}
            title="Обновить статус заказа"
          >
            <IoRefreshOutline className="text-xl" />
          </button>
          {isExpanded ? (
            <IoChevronUpOutline className="text-gray-500 text-xl" />
          ) : (
            <IoChevronDownOutline className="text-gray-500 text-xl" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 bg-white p-3 rounded-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.product.images?.[0] || "/placeholder.jpg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.product.name}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.product.title}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-700">
                      Количество: <span className="font-medium">{item.quantity}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {item.product.price} ₸
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white p-4 rounded-lg">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Адрес доставки:</p>
                <p className="text-sm text-gray-600">{order.address}</p>
              </div>

              {order.additional_info && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Дополнительная информация:</p>
                  <p className="text-sm text-gray-600">{order.additional_info}</p>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100">
                <p className="font-medium text-gray-900 flex justify-between">
                  <span>Итоговая сумма:</span>
                  <span className="text-orange-500">{order.total} ₸</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
