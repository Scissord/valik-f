import Link from "next/link";
import React from "react";
import { IoPersonOutline, IoTicketOutline } from "react-icons/io5";

export const ItemUser = () => {
  return (
    <div>
      <Link
        href="/profile"
        className="flex p-2 items-center mt-8 hover:bg-gray-100 rounded transition-all"
      >
        <IoPersonOutline size={25} />
        <span className="ml-3 text-xl"> Perfil</span>
      </Link>

      <Link
        href="/orders"
        className="flex p-2 items-center mt-8 hover:bg-gray-100 rounded transition-all"
      >
        <IoTicketOutline size={25} />
        <span className="ml-3 text-xl"> Ordenes</span>
      </Link>
    </div>
  );
};
