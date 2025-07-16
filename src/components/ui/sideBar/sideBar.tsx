"use client";
import { useState, useEffect } from "react";
import { useUIStore } from "@/store";
import { GoodCategory } from "@/interfaces";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoCloseOutline, IoChevronDownOutline, IoGridOutline, IoCartOutline } from "react-icons/io5";
import { getCategories } from '@/api';
import { ItemSiginOut } from "./itemSiginOut";

export const SideBar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const pathname = usePathname();
  const [categories, setCategories] = useState<GoodCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Запрос категорий из компонента SideBar');
        const categoriesData = await getCategories();
        console.log('Категории получены в компоненте:', categoriesData);
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
  const getCurrentCategoryId = (): string | null => {
    const match = pathname.match(/\/categories\/(\w+)/);
    return match ? match[1] : null;
  };

  // Функция для поиска родительских категорий
  const findParentCategories = (
    categories: GoodCategory[], 
    targetId: string, 
    path: string[] = []
  ): string[] | null => {
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

  const toggleCategory = (categoryId: string) => {
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
                {category.title}
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

  return (
    <>
      {/* Затемняющий фон */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed top-0 left-0 w-screen h-screen z-55 bg-black/50 backdrop-blur-sm transition-opacity duration-300 fade-in"
        />
      )}

      {/* Боковое меню */}
      <aside
        className={clsx(
          "fixed top-0 right-0 h-screen w-[300px] md:w-[350px] bg-white z-60 shadow-xl transition-transform duration-300 ease-in-out transform",
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

        {/* Содержимое прокручиваемой области */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
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
        </div>
      </aside>
    </>
  );
};
