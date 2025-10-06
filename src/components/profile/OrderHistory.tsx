"use client";

import { getOrders } from "@/api";
import { IOrder } from "@/interfaces";
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
        setOrders(data);
      } catch (_error) {
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
        <h2 className="text-xl font-semibold text-gray-800">История заказов</h2>
      </div>
      
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <IoReceiptOutline className="text-orange-500 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">У вас нет заказов.</p>
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