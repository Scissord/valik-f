"use client";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useUIStore, useUserStore } from "@/store";
import { GoodCategory } from "@/interfaces";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoCloseOutline, IoSearchOutline, IoHomeOutline, IoPersonOutline, IoShirtOutline, IoWomanOutline, IoLogOutOutline, IoLogInOutline, IoCartOutline, IoMenuOutline, IoChevronDownOutline, IoGridOutline } from "react-icons/io5";
import { FaChild } from "react-icons/fa";
import { getCategories } from '@/api';

export const SideBar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();
  const [categories, setCategories] = useState<GoodCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Функция для получения ID категории из URL
  const getCurrentCategoryId = (): number | null => {
    const match = pathname.match(/\/categories\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };
  
  // Функция для поиска родительских категорий
  const findParentCategories = (
    categories: GoodCategory[], 
    targetId: number, 
    path: number[] = []
  ): number[] | null => {
    for (const category of categories) {
      if (category.id === targetId) {
        return [...path, category.id];
      }
      
      if (category.children && category.children.length > 0) {
        const result = findParentCategories(
          category.children, 
          targetId, 
          [...path, category.id]
        );
        if (result) return result;
      }
    }
    
    return null;
  };
  
  // При монтировании и изменении URL автоматически раскрываем текущую категорию
  useEffect(() => {
    const currentCategoryId = getCurrentCategoryId();
    if (currentCategoryId && categories.length > 0) {
      const path = findParentCategories(categories, currentCategoryId);
      if (path) {
        setExpandedCategories(path);
      }
    }
  }, [pathname, categories]);

  const toggleCategory = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const renderCategory = (category: GoodCategory, level: number = 0) => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;
    const productCount = category.totalProductCount || category._count?.goods || 0;
    const currentCategoryId = getCurrentCategoryId();
    const isActive = currentCategoryId === category.id;
    
    return (
      <div key={category.id} className="w-full">
        <div 
          className={`
            group relative flex items-center justify-between py-2 px-3
            ${level > 0 ? 'pl-' + (level * 4 + 3) : ''}
            ${isActive ? 'bg-gray-50 text-[#fc640c] font-medium' : 'hover:bg-gray-50'}
            cursor-pointer transition-all duration-200
          `}
          onClick={() => hasChildren && toggleCategory(category.id)}
        >
          <Link 
            href={`/categories/${category.id}`}
            className="flex-grow flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
            }}
          >
            {level === 0 && (
              <span className="text-gray-500 group-hover:text-[#fc640c] transition-colors mr-2">
                <IoCartOutline className="w-5 h-5" />
              </span>
            )}
            
            <div className="flex flex-col">
              <span className={`text-sm ${isActive ? 'text-[#fc640c]' : 'text-gray-700'}`}>
                {category.name}
              </span>
              {level === 0 && (
                <span className="text-xs text-gray-400 mt-0.5">
                  {productCount} товаров
                </span>
              )}
            </div>
          </Link>
          
          {hasChildren && (
            <div 
              className={`
                flex items-center justify-center w-5 h-5 rounded-full
                ${isActive ? 'text-[#fc640c]' : 'text-gray-500'} 
                transition-transform ${isExpanded ? 'rotate-180' : ''}
              `}
            >
              <IoChevronDownOutline className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className="animate-slideDown">
            {category.children?.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Основные разделы
  const mainSections = [
    { name: "Главная", icon: <IoHomeOutline className="w-5 h-5" />, href: "/" },
    { name: "Инструменты", icon: <IoShirtOutline className="w-5 h-5" />, href: "/categories/tools" },
    { name: "Материалы", icon: <IoWomanOutline className="w-5 h-5" />, href: "/categories/materials" },
    { name: "Сантехника", icon: <FaChild className="w-5 h-5" />, href: "/categories/plumbing" },
  ];

  return (
    <>
      {/* Затемняющий фон */}
      {isSideMenuOpen && (
        <div 
          onClick={closeMenu}
          className="fixed top-0 left-0 w-screen h-screen z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 fade-in"
        />
      )}

      {/* Боковое меню */}
      <aside
        className={clsx(
          "fixed top-0 right-0 h-screen w-[300px] md:w-[350px] bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out transform",
          {
            "translate-x-0": isSideMenuOpen,
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        {/* Заголовок и кнопка закрытия */}
        <div className="flex items-center justify-between px-5 py-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Меню</h2>
          <button
            onClick={closeMenu}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Закрыть меню"
          >
            <IoCloseOutline className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Поиск */}
        <div className="px-5 py-4">
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск товаров..."
              className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc640c] focus:border-transparent"
            />
          </div>
        </div>

        {/* Содержимое прокручиваемой области */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 270px)' }}>
          {/* Основная навигация */}
          <nav className="px-3 py-4">
            <div className="space-y-1">
              {mainSections.map((section) => (
                <Link
                  key={section.name}
                  href={section.href}
                  onClick={closeMenu}
                  className={`
                    flex items-center px-3 py-3 rounded-lg transition-colors group
                    ${pathname === section.href ? 'bg-gray-50 text-[#fc640c]' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  <span className={`transition-colors mr-4 ${pathname === section.href ? 'text-[#fc640c]' : 'text-gray-500 group-hover:text-[#fc640c]'}`}>
                    {section.icon}
                  </span>
                  <span className={`font-medium ${pathname === section.href ? 'text-[#fc640c]' : 'group-hover:text-[#fc640c]'}`}>
                    {section.name}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Разделитель */}
          <div className="px-5 py-2">
            <div className="h-px bg-gray-200"></div>
          </div>

          {/* Категории товаров */}
          <div className="px-3 py-4">
            <div className="flex items-center px-3 mb-2">
              <span className="text-gray-500 mr-3">
                <IoGridOutline className="w-5 h-5" />
              </span>
              <h3 className="font-medium text-gray-800">Категории</h3>
            </div>
            
            <div className="mt-2">
              {loading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ) : categories.length > 0 ? (
                categories.map(category => renderCategory(category))
              ) : (
                <p className="py-4 px-4 text-sm text-gray-500 text-center">Категории не найдены</p>
              )}
            </div>
          </div>

          {/* Разделитель */}
          <div className="px-5 py-2">
            <div className="h-px bg-gray-200"></div>
          </div>

          {/* Пользовательские ссылки */}
          <div className="px-3 py-4">
            <div className="space-y-1">
              {user && (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-gray-500 group-hover:text-[#fc640c] transition-colors mr-4">
                      <IoPersonOutline className="w-5 h-5" />
                    </span>
                    <span className="font-medium group-hover:text-[#fc640c] transition-colors">
                      Мой профиль
                    </span>
                  </Link>
                  
                  <Link
                    href="/orders"
                    onClick={closeMenu}
                    className="flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-gray-500 group-hover:text-[#fc640c] transition-colors mr-4">
                      <IoCartOutline className="w-5 h-5" />
                    </span>
                    <span className="font-medium group-hover:text-[#fc640c] transition-colors">
                      Мои заказы
                    </span>
                  </Link>
                  
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-gray-500 group-hover:text-[#fc640c] transition-colors mr-4">
                        <IoMenuOutline className="w-5 h-5" />
                      </span>
                      <span className="font-medium group-hover:text-[#fc640c] transition-colors">
                        Админ-панель
                      </span>
                    </Link>
                  )}
                </>
              )}

              {/* Кнопка входа/выхода */}
              {!user ? (
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className="flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-gray-500 group-hover:text-[#fc640c] transition-colors mr-4">
                    <IoLogInOutline className="w-5 h-5" />
                  </span>
                  <span className="font-medium group-hover:text-[#fc640c] transition-colors">
                    Войти
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-gray-500 group-hover:text-red-500 transition-colors mr-4">
                    <IoLogOutOutline className="w-5 h-5" />
                  </span>
                  <span className="font-medium text-left group-hover:text-red-500 transition-colors">
                    Выйти
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="sticky bottom-0 left-0 right-0 px-5 py-6 border-t bg-gray-50">
          <p className="text-sm text-gray-500">Нужна помощь?</p>
          <p className="text-lg font-medium text-gray-800">+7-(777)-(777)-77-77</p>
        </div>
      </aside>
    </>
  );
};
