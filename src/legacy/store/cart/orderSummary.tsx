"use client";
import Link from "next/link";
import { useCartStore } from "./cartStore";
import { useEffect, useState } from "react";
import { useShallow } from 'zustand/react/shallow'
import { currencyFormat } from "@/lib/legacy";

export const OrderSummary = () => {
  const [loading, setLoaded] = useState(false);
  const { total, count } =
  useCartStore(useShallow((state) =>state.getSummaryInformation()));

  useEffect(() => {
    setLoaded(true);
  },[]);

  if (!loading) {
    return <p>Loading ... </p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
      <h2 className="text-2xl mb-2">Сводка заказа</h2>
      <div className="grid grid-cols-2">
        <span>Кол-во</span>
        <span className=" text-right">
          {count}
        </span>
        {/* <span className=" text-right"> {currencyFormat(tax)}</span> */}
        <span className="mt-5 text-2xl">Итого:</span>
        <span className="mt-5 text-2xl text-right"> {currencyFormat(total)}</span>
      </div>
      <div className="mt-5 mb-2 w-full">
        <Link
          className="flex btn-primary justify-center"
          href={"/checkout"}
        >
          Оплатить
        </Link>
      </div>
    </div>
  );
};
