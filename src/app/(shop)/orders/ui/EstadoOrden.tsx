import clsx from "clsx";
import React from "react";
import { IoCartOutline } from "react-icons/io5";

interface Props {
  isPaid: boolean;
}
export const EstadoOrden = ({ isPaid }: Props) => {
  return (
    <div
      className={clsx(
        "flex items-center rounded-lg py-1 px-3.5 font-bold text-white mb-5",
        { "bg-red-500": !isPaid, "bg-green-500": isPaid }
      )}
    >
      <IoCartOutline size={30} />
      <span className="mx-2">
        {isPaid ? "Order pagada" : "Pendiente de pago"}
      </span>
    </div>
  );
};
