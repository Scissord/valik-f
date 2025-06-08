"use client";
import { signOut, useSession } from "next-auth/react";

import { useUIStore } from "@/store";
import clsx from "clsx";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { ItemUser } from "./itemUser";
import { ItemAdmin } from "./itemAdmin";
import { ItemSiginOut } from "./itemSiginOut";

export const SideBar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const roleUser = session?.user.role;

  return (
    <div>
      {isSideMenuOpen && (
        /* background */
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
      )}

      {isSideMenuOpen && (
        /*blur*/
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        ></div>
      )}

      {/*sidebar*/}
      <nav
        className={clsx(
          "fixed p-4 right-0 top-0 w-[400px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={35}
          onClick={closeMenu}
          className=" absolute top-3 right-3 cursor-pointer"
        />
        <div className="relative mt-12">
          {/*Barra de busqueda */}
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          ></input>
        </div>

        {/*Resto de items */}
        {isAuthenticated && roleUser === "user" && <ItemUser />}

        {isAuthenticated && roleUser === "admin" && <ItemAdmin />}

        {/*Item login/ logout*/}
        {!isAuthenticated && (
          <ItemSiginOut
            text={"Войти"}
            method={closeMenu}
            url={"/auth/login"}
            login={false}
          />
        )}
        {isAuthenticated && (
          <ItemSiginOut
            text={"Salir"}
            method={() => signOut()}
            url={"/"}
            login={false}
          />
        )}
      </nav>
    </div>
  );
};
