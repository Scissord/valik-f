'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHomeOutline, IoHome, IoGridOutline, IoGrid, IoCartOutline, IoCart, IoPersonOutline, IoPerson } from "react-icons/io5";

export const MobileNavbar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Главная",
      href: "/",
      activeIcon: <IoHome className="h-6 w-6" />,
      inactiveIcon: <IoHomeOutline className="h-6 w-6" />,
    },
    {
      name: "Категории",
      href: "/categories",
      activeIcon: <IoGrid className="h-6 w-6" />,
      inactiveIcon: <IoGridOutline className="h-6 w-6" />,
    },
    {
      name: "Корзина",
      href: "/cart",
      activeIcon: <IoCart className="h-6 w-6" />,
      inactiveIcon: <IoCartOutline className="h-6 w-6" />,
    },
    {
      name: "Профиль",
      href: "/profile",
      activeIcon: <IoPerson className="h-6 w-6" />,
      inactiveIcon: <IoPersonOutline className="h-6 w-6" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              href={item.href} 
              key={item.name}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <div className="text-center">
                <div className="flex justify-center">
                  {isActive ? (
                    <span className="text-orange-500">{item.activeIcon}</span>
                  ) : (
                    <span className="text-gray-500">{item.inactiveIcon}</span>
                  )}
                </div>
                <span 
                  className={`text-xs mt-1 ${isActive ? 'text-orange-500 font-medium' : 'text-gray-500'}`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar; 