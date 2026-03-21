"use client";

import { getOrders, IOrder } from "@/lib/legacy";
import { useEffect, useState } from "react";
import { OrderItem } from "./OrderItem";
import { IoReceiptOutline } from "react-icons/io5";

export const OrderHistory = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        
        // Адаптируем данные: преобразуем структуру API в формат компонента
        const adaptedOrders = data.map((order: any) => ({
          id: order.id,
          user_id: order.buyer?.id || '',
          status: order.order_status || 0,
          total: parseFloat(order.total_amount || '0'),
          created_at: order.created_at,
          address: order.address || '',
          phone: order.buyer?.phone || '',
          full_name: order.buyer?.name || '',
          additional_info: order.additional_info || '',
          items: (order.sell_product || []).map((sellProduct: any) => ({
            id: sellProduct.id,
            product_id: sellProduct.product_original?.id || sellProduct.id,
            quantity: sellProduct.quantity || 1,
            price: parseFloat(sellProduct.product_original?.price || '0'),
            total: (sellProduct.quantity || 1) * parseFloat(sellProduct.product_original?.price || '0'),
            product: sellProduct.product_original ? {
              ...sellProduct.product_original,
              images: sellProduct.product_original.images || 
                      (sellProduct.product_original.image ? [sellProduct.product_original.image] : [])
            } : null
          }))
        }));
        
        setOrders(adaptedOrders);
      } catch {
        setError("Не удалось загрузить заказы.");
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <div className="animate-pulse flex flex-col items-center">
      <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-32"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <h2 className="text-[18px] font-semibold text-gray-800">История заказов</h2>
      </div>
      
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <IoReceiptOutline className="text-orange-500 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">У вас еще не было заказов.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};
