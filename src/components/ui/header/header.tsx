"use client";
import { useCartStore, useUIStore } from "@/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import Logo from "./logo";
import Search from "./search";

export const Header = () => {
  const totalITems = useCartStore((state) => state.getTotalItems());
  const openMenu = useUIStore((state) => state.openSideMenu);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  },[]);

  return (
    <header className="h-[10vh] hidden lg:flex justify-between items-center w-full py-12">
      <Logo/>
      <nav>
        {/* <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/men"
        >
          Мужское
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/women"
        >
          Женское
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/kid"
        >
          Детское
        </Link> */}
        <Search/>
      </nav>
      <p className="text-xl font-bold">+7-(777)-(777)-77-77</p>
      <div className="flex items-center">
        <Link href={totalITems===0 && loaded?"/empty":"/cart"} className="mx-2">
          <div className="relative">
            {loaded && totalITems > 0 && (
              <span className="fade-in absolute text-xs rounded-full px-1 font-bold -top-3 -right-2  text-white bg-[#fc640c]">
                {totalITems}
              </span>
            )}
            <IoCartOutline className="w-6 h-6" />
          </div>
        </Link>
        <button
          onClick={openMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Меню
        </button>
      </div>
    </header>
  );
};
