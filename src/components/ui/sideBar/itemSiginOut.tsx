import Link from "next/link";
import React from "react";
import { IoLogInOutline, IoLogOutOutline } from "react-icons/io5";

interface Props {
  text: string;
  method: () => void;
  url: string;
  login: boolean;
}
//TODO borrar local storage, si cambias de usuario te va a poner los datos del anterior logeado
export const ItemSiginOut = ({ method, text, url, login }: Props) => {
  return (
    <Link
      href={url}
      className="flex p-2 items-center mt-8 hover:bg-gray-100 rounded transition-all"
      onClick={method}
    >
      {login ? <IoLogInOutline size={25} /> : <IoLogOutOutline size={25} />}
      <span className="ml-3 text-xl"> {text}</span>
    </Link>
  );
};
