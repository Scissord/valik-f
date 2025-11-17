'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IoHomeOutline, IoHome, 
  IoCartOutline, IoCart, 
  IoPersonOutline, IoPerson
} from "react-icons/io5";
import { useUserStore } from "@/lib/legacy";

export const MobileNavbar = () => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  // Базовые элементы навигации для всех пользователей
  const navItems = [
    {
      name: "Главная",
      href: "/",
      activeIcon: <IoHome className="h-6 w-6" />,
      inactiveIcon: <IoHomeOutline className="h-6 w-6" />,
    },

    {
      name: "Корзина",
      href: "/cart",
      activeIcon: <IoCart className="h-6 w-6" />,
      inactiveIcon: <IoCartOutline className="h-6 w-6" />,
    },
    {
      name: "Профиль",
      href: user ? "/profile" : "/auth/login",
      activeIcon: <IoPerson className="h-6 w-6" />,
      inactiveIcon: <IoPersonOutline className="h-6 w-6" />,
    }
  ];

  return (
    <>
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
      {/* Placeholder to prevent content from being hidden behind the navbar */}
      <div className="h-16 lg:hidden" />
    </>
  );
};

export default MobileNavbar;
