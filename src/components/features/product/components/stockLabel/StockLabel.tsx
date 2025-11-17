"use client";

import { titleFont } from "@/config/fonts";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug: _slug }: Props) => {
  const [stock, _setStock] = useState<number>(0);
  const [isLoading, _setLoading] = useState<boolean>(true);

  useEffect(() => {
    getStockActual();
  });

  const getStockActual = async () => {
    // const inStock = await getStockBySlug(slug);
    // setStock(inStock);
    // setLoading(false);
    // return inStock;
  };

  if (stock < 1 && !isLoading) {
    return (
      <p className={`text-md font-bold ${titleFont.className} `}>Sin stock</p>
    );
  }
  return (
    <>
      {isLoading ? (
        <p
          className={`text-md font-bold ${titleFont.className} animate-pulse bg-slate-200`}
        >
          &nbsp;
        </p>
      ) : (
        <p className={`text-md font-bold ${titleFont.className} `}>
          Stock: {stock}
        </p>
      )}
    </>
  );
};
