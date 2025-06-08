'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { findOrder } from '@/api';
import { useForm } from 'react-hook-form';
import { IOrder } from '@/interfaces';
import clsx from 'clsx';

type FormInputs = {
  order_id: string;
};

export default function OrderPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<IOrder | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
  } = useForm<FormInputs>();

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) {
      reset({ order_id: orderId });

      const fetchOrder = async () => {
        const order = await findOrder({ order_id: orderId });
        setOrder(order);
      };

      fetchOrder();
    }
  }, [searchParams, reset]);

  const onSubmit = async (data: FormInputs) => {
    const { order_id } = data;
    const order = await findOrder({ order_id });
    setOrder(order);
  };

  return (
    <div className="flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2 border border-slate-200 p-6 rounded-lg w-1/2"
      >
        <div className="flex flex-col mb-2">
          <span>Номер заказа</span>
          <input
            type="text"
            className="p-2 border border-slate-300 rounded-md"
            {...register("order_id", { required: "Укажите номер заказа!" })}
          />
          {errors.order_id && (
            <p className="text-red-500 text-sm">{errors.order_id.message}</p>
          )}
        </div>

        {order && (
          <div className='flex flex-col gap-3'>
            <p>
              <span className='font-semibold'>Номер: </span>
              {order.id}
            </p>
            <p>
              <span className='font-semibold'>Имя: </span>
              {order.name}
            </p>
            <p>
              <span className='font-semibold'>Телефон: </span>
              {order.phone}
            </p>
            <p>
              <span className='font-semibold'>Сумма: </span>
              {order.total}
            </p>
            <p>
              <span className='font-semibold'>Статус: </span>
              {order.status}
            </p>
            <p>
              <span className='font-semibold'>Дата создания: </span>
              {order.created_at}
            </p>
            <p>
              <span className='font-semibold'>Дата обновления: </span>
              {order.updated_at}
            </p>
            {order.items.map((item, index) => (
              <div key={item.id} className='flex flex-col gap-3'>
                <p>
                  <span className='font-semibold'>Товар №{index + 1}: </span>
                  {item.product.title} - {item.quantity}{item.unit.title} - {item.total}тг.
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          disabled={!isValid}
          type="submit"
          className={clsx({
            "btn-primary": isValid,
            "btn-disabled": !isValid,
          })}
        >
          Проверить
        </button>
      </form>
    </div>
  );
}
