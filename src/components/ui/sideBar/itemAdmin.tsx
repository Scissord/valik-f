import Link from "next/link";
import React from "react";
import {
  IoPeopleOutline,
  IoPersonOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

export const ItemAdmin = () => {
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

      <div className="w-full h-px bg-gray-200 my-10" />
      <Link
        href="/admin/products"
        className="flex p-2 items-center mt-8 hover:bg-gray-100 rounded transition-all"
      >
        <IoShirtOutline size={25} />
        <span className="ml-3 text-xl">Administración de productos</span>
      </Link>
      <Link
        href="/admin/users"
        className="flex p-2 items-center mt-8 hover:bg-gray-100 rounded transition-all"
      >
        <IoPeopleOutline size={25} />
        <span className="ml-3 text-xl">Administración de usuarios</span>
      </Link>
      <Link
        href="/admin/orders"
        className="flex p-2 items-center mt-8 hover:bg-gray-100 rounded transition-all"
      >
        <IoTicketOutline size={25} />
        <span className="ml-3 text-xl">Ordenes de clientes</span>
      </Link>
    </div>
  );
};
