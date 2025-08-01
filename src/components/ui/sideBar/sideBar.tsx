"use client";
import { useState, useEffect } from "react";
import { useUIStore } from "@/store";
import { GoodCategory } from "@/interfaces";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoCloseOutline, IoChevronDownOutline, IoGridOutline, IoConstructOutline, IoHomeOutline, IoCarOutline, IoInformationCircleOutline, IoCallOutline } from "react-icons/io5";
import { getCategories } from '@/api';
import { ItemSiginOut } from "./itemSiginOut";
import { FaTools, FaTractor, FaPaintRoller } from 'react-icons/fa';
import { GiBrickWall, GiWoodBeam, GiHeatHaze } from 'react-icons/gi';
import {
  MdWallpaper, MdOutlineLayers, MdOutlineDoorFront, MdChair,
  MdOutlineFormatPaint, MdAgriculture, MdOutlineWater, MdHvac,
  MdHomeRepairService, MdStyle, MdMicrowave, MdHardware,
  MdElectricalServices, MdHandyman
} from "react-icons/md";

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

  const getCategoryIcon = (categoryTitle: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'обои': <MdWallpaper className="h-5 w-5" />,
      'сантехника': <MdOutlineWater className="h-5 w-5" />,
      'покрытия для пола': <MdOutlineLayers className="h-5 w-5" />,
      'кафель': <MdOutlineLayers className="h-5 w-5" />,
      'двери': <MdOutlineDoorFront className="h-5 w-5" />,
      'мебель': <MdChair className="h-5 w-5" />,
      'лаки, краски, клей': <MdOutlineFormatPaint className="h-5 w-5" />,
      'инструменты': <FaTools className="h-5 w-5" />,
      'для дома, сада и огорода': <MdAgriculture className="h-5 w-5" />,
      'водоснабжение, отопление и вентиляция': <MdHvac className="h-5 w-5" />,
      'оборудование': <MdHomeRepairService className="h-5 w-5" />,
      'декор': <MdStyle className="h-5 w-5" />,
      'бытовая техника': <MdMicrowave className="h-5 w-5" />,
      'крепёж': <MdHardware className="h-5 w-5" />,
      'строительные материалы': <GiBrickWall className="h-5 w-5" />,
      'электротовары': <MdElectricalServices className="h-5 w-5" />,
      'автомобильные товары': <IoCarOutline className="h-5 w-5" />,
      'ручной инструмент': <MdHandyman className="h-5 w-5" />,
      // Резервные ключи
      'отделка': <FaPaintRoller className="h-5 w-5" />,
      'дерево': <GiWoodBeam className="h-5 w-5" />,
      'отопление': <GiHeatHaze className="h-5 w-5" />,
      'сад': <MdAgriculture className="h-5 w-5" />,
      'техника': <FaTractor className="h-5 w-5" />,
      'дом': <IoHomeOutline className="h-5 w-5" />,
    };

    const title = categoryTitle.toLowerCase();
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (title.includes(keyword)) {
        return icon;
      }
    }

    return <IoConstructOutline className="h-5 w-5" />;
  };

  const renderCategory = (category: GoodCategory, level: number = 0) => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;
    const currentCategoryId = getCurrentCategoryId();
    const isActive = currentCategoryId === category.id;
    const icon = getCategoryIcon(category.title);

    // Определяем отступ в зависимости от уровня вложенности
    const getPaddingClass = (level: number) => {
      switch (level) {
        case 0: return 'px-3';
        case 1: return 'pl-8 pr-3';
        case 2: return 'pl-12 pr-3';
        case 3: return 'pl-16 pr-3';
        default: return 'pl-20 pr-3';
      }
    };

    return (
      <div key={category.id} className="w-full">
        <div
          className={`
            group relative flex items-center justify-between py-2.5 rounded-md
            ${getPaddingClass(level)}
            ${isActive ? 'bg-orange-50 text-orange-500 font-medium' : 'hover:bg-gray-50'}
            cursor-pointer transition-all duration-200
          `}
          onClick={() => hasChildren && toggleCategory(category.id)}
        >
          <Link
            href={`/categories/${category.id}`}
            className="flex-grow flex items-center gap-3"
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
            }}
          >
            {/* Индикатор подкатегории */}
            {level > 0 && (
              <div className="flex items-center">
                <div className="w-3 h-px bg-gray-300 mr-1"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
              </div>
            )}

            <span className={`text-gray-500 transition-colors group-hover:text-orange-500 ${isActive ? 'text-orange-500' : ''} ${level > 0 ? 'text-xs' : ''}`}>
              {icon}
            </span>

            <span className={`${level > 0 ? 'text-xs' : 'text-sm'} ${isActive ? '' : 'text-gray-700'}`}>
              {category.title}
            </span>
          </Link>

          {hasChildren && (
            <div
              className={`
                flex items-center justify-center rounded-full
                ${level > 0 ? 'w-4 h-4' : 'w-5 h-5'}
                ${isActive ? 'text-orange-500' : 'text-gray-500'}
                transition-transform ${isExpanded ? 'rotate-180' : ''}
              `}
            >
              <IoChevronDownOutline className={level > 0 ? 'w-3 h-3' : 'w-4 h-4'} />
            </div>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1 animate-slideDown">
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
          {/* Основные разделы */}
          <div className="px-3 py-4 border-b">
            <div className="space-y-1">
              <Link
                href="/about"
                onClick={closeMenu}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-gray-50 transition-colors ${pathname === '/about' ? 'bg-orange-50 text-orange-500 font-medium' : ''}`}
              >
                <span className={`text-gray-500 transition-colors ${pathname === '/about' ? 'text-orange-500' : ''}`}>
                  <IoInformationCircleOutline className="w-5 h-5" />
                </span>
                <span className={`text-sm ${pathname === '/about' ? 'text-orange-500' : 'text-gray-700'}`}>
                  О сервисе
                </span>
              </Link>

              <Link
                href="/contacts"
                onClick={closeMenu}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-gray-50 transition-colors ${pathname === '/contacts' ? 'bg-orange-50 text-orange-500 font-medium' : ''}`}
              >
                <span className={`text-gray-500 transition-colors ${pathname === '/contacts' ? 'text-orange-500' : ''}`}>
                  <IoCallOutline className="w-5 h-5" />
                </span>
                <span className={`text-sm ${pathname === '/contacts' ? 'text-orange-500' : 'text-gray-700'}`}>
                  Контакты
                </span>
              </Link>
            </div>
          </div>

          {/* Категории товаров */}
          <div className="px-3 py-4">
            <Link
              href="/categories"
              onClick={closeMenu}
              className="flex items-center px-3 mb-3 group"
            >
              <span className="text-gray-500 mr-3 transition-colors group-hover:text-orange-500">
                <IoGridOutline className="w-5 h-5" />
              </span>
              <h3 className="font-medium text-gray-800 transition-colors group-hover:text-orange-500">Все категории</h3>
            </Link>

            <div className="mt-2 space-y-1">
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
