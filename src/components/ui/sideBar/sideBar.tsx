"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategories } from "@/api";
import { useUIStore } from "@/store";
import { GoodCategory } from "@/interfaces";

import {
  IoCallOutline,
  IoCarOutline,
  IoChevronDownOutline,
  IoCloseOutline,
  IoConstructOutline,
  IoHomeOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { FaPaintRoller, FaTools, FaTractor } from "react-icons/fa";
import { GiBrickWall, GiHeatHaze, GiWoodBeam } from "react-icons/gi";
import {
  MdAgriculture,
  MdChair,
  MdElectricalServices,
  MdHandyman,
  MdHardware,
  MdHomeRepairService,
  MdHvac,
  MdMicrowave,
  MdOutlineDoorFront,
  MdOutlineFormatPaint,
  MdOutlineLayers,
  MdOutlineWater,
  MdStyle,
  MdWallpaper,
} from "react-icons/md";

export const SideBar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const pathname = usePathname();
  const [categories, setCategories] = useState<GoodCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const areArraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const getCurrentCategoryId = useCallback((): string | null => {
    const match = pathname.match(/\/categories\/(\w+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const findParentCategories = useCallback(function findParent(
    tree: GoodCategory[],
    targetId: string,
    path: string[] = []
  ): string[] | null {
    for (const category of tree) {
      if (category.id === targetId) {
        return [...path, category.id];
      }

      if (category.children && category.children.length > 0) {
        const result = findParent(category.children, targetId, [
          ...path,
          category.id,
        ]);
        if (result) return result;
      }
    }

    return null;
  }, []);

  useEffect(() => {
    const currentCategoryId = getCurrentCategoryId();
    if (currentCategoryId && categories.length > 0) {
      const path = findParentCategories(categories, currentCategoryId);
      if (path) {
        setExpandedCategories((prev) =>
          areArraysEqual(prev, path) ? prev : path
        );
      }
    }
  }, [categories, findParentCategories, getCurrentCategoryId]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryIcon = (categoryTitle: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      обои: <MdWallpaper className="h-5 w-5" />,
      сантехника: <MdOutlineWater className="h-5 w-5" />,
      "покрытия для пола": <MdOutlineLayers className="h-5 w-5" />,
      кафель: <MdOutlineLayers className="h-5 w-5" />,
      двери: <MdOutlineDoorFront className="h-5 w-5" />,
      мебель: <MdChair className="h-5 w-5" />,
      "лаки, краски, клей": <MdOutlineFormatPaint className="h-5 w-5" />,
      инструменты: <FaTools className="h-5 w-5" />,
      "для дома, сада и огорода": <MdAgriculture className="h-5 w-5" />,
      "водоснабжение, отопление и вентиляция": <MdHvac className="h-5 w-5" />,
      оборудование: <MdHomeRepairService className="h-5 w-5" />,
      декор: <MdStyle className="h-5 w-5" />,
      "бытовая техника": <MdMicrowave className="h-5 w-5" />,
      крепёж: <MdHardware className="h-5 w-5" />,
      "строительные материалы": <GiBrickWall className="h-5 w-5" />,
      электротовары: <MdElectricalServices className="h-5 w-5" />,
      "автомобильные товары": <IoCarOutline className="h-5 w-5" />,
      "ручной инструмент": <MdHandyman className="h-5 w-5" />,
      отделка: <FaPaintRoller className="h-5 w-5" />,
      дерево: <GiWoodBeam className="h-5 w-5" />,
      отопление: <GiHeatHaze className="h-5 w-5" />,
      сад: <MdAgriculture className="h-5 w-5" />,
      техника: <FaTractor className="h-5 w-5" />,
      дом: <IoHomeOutline className="h-5 w-5" />,
    };

    const title = categoryTitle.toLowerCase();
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (title.includes(keyword)) {
        return icon;
      }
    }

    return <IoConstructOutline className="h-5 w-5" />;
  };

  const renderCategory = (
    category: GoodCategory,
    level: number = 0,
    onNavigate?: () => void
  ): JSX.Element => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren =
      category.children && category.children.length > 0;
    const currentCategoryId = getCurrentCategoryId();
    const isActive = currentCategoryId === category.id;
    const icon = getCategoryIcon(category.title);

    const getPaddingClass = (depth: number) => {
      switch (depth) {
        case 0:
          return "px-3";
        case 1:
          return "pl-8 pr-3";
        case 2:
          return "pl-12 pr-3";
        case 3:
          return "pl-16 pr-3";
        default:
          return "pl-20 pr-3";
      }
    };

    return (
      <div key={category.id} className="w-full">
        <div
          className={`
            group relative flex items-center justify-between py-2.5 rounded-md border
            ${getPaddingClass(level)}
            ${
              isActive
                ? "border-gray-300 bg-gray-50 text-orange-600 font-semibold"
                : "border-transparent hover:border-gray-200 hover:bg-gray-50"
            }
            cursor-pointer transition-all duration-200
          `}
          onClick={() => hasChildren && toggleCategory(category.id)}
        >
          <Link
            href={`/categories/${category.id}`}
            className="flex-grow flex items-center gap-3"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.();
            }}
          >
            {level > 0 && (
              <div className="flex items-center">
                <div className="w-3 h-px bg-gray-300 mr-1" />
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
              </div>
            )}

            <span
              className={`text-gray-500 transition-colors group-hover:text-orange-500 ${
                isActive ? "text-orange-500" : ""
              } ${level > 0 ? "text-xs" : ""}`}
            >
              {icon}
            </span>

            <span
              className={`${level > 0 ? "text-xs" : "text-sm"} ${
                isActive ? "" : "text-gray-700"
              }`}
            >
              {category.title}
            </span>
          </Link>

          {hasChildren && (
            <div
              className={`
                flex items-center justify-center rounded-full
                ${level > 0 ? "w-4 h-4" : "w-5 h-5"}
                ${isActive ? "text-orange-500" : "text-gray-500"}
                transition-transform ${isExpanded ? "rotate-180" : ""}
              `}
            >
              <IoChevronDownOutline
                className={level > 0 ? "w-3 h-3" : "w-4 h-4"}
              />
            </div>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1 animate-slideDown">
            {category.children?.map((child) =>
              renderCategory(child, level + 1, onNavigate)
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMobileSkeleton = () => (
    <div className="flex justify-center items-center py-6">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-8 h-8 rounded-full mb-2 bg-gray-200" />
        <div className="h-3 rounded w-1/2 mb-2 bg-gray-200/70" />
        <div className="h-2 rounded w-1/3 bg-gray-200/50" />
      </div>
    </div>
  );

  const renderDesktopSkeleton = () => (
    <div className="flex justify-center items-center py-6">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-10 h-10 rounded-full mb-2 bg-gray-200" />
        <div className="h-3 rounded w-3/4 mb-2 bg-gray-200/70" />
        <div className="h-2 rounded w-1/2 bg-gray-200/50" />
      </div>
    </div>
  );

  const MobileSidebarContent = () => (
    <>
      <div className="flex items-center justify-between px-5 py-6 bg-white border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Меню</h2>
        <button
          onClick={closeMenu}
          className="p-2 rounded-full transition-colors hover:bg-gray-100"
          aria-label="Закрыть меню"
        >
          <IoCloseOutline className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto bg-white"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        <div className="px-3 py-4">
          <div className="space-y-1">
            <Link
              href="/about"
              onClick={closeMenu}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-xl border transition-colors ${
                pathname === "/about"
                  ? "border-gray-300 bg-gray-50 text-orange-500 font-medium"
                  : "border-transparent hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span
                className={`text-gray-500 transition-colors ${
                  pathname === "/about" ? "text-orange-500" : ""
                }`}
              >
                <IoInformationCircleOutline className="w-5 h-5" />
              </span>
              <span
                className={`text-sm ${
                  pathname === "/about" ? "text-orange-500" : "text-gray-700"
                }`}
              >
                О сервисе
              </span>
            </Link>

            <Link
              href="/contacts"
              onClick={closeMenu}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-xl border transition-colors ${
                pathname === "/contacts"
                  ? "border-gray-300 bg-gray-50 text-orange-500 font-medium"
                  : "border-transparent hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span
                className={`text-gray-500 transition-colors ${
                  pathname === "/contacts" ? "text-orange-500" : ""
                }`}
              >
                <IoCallOutline className="w-5 h-5" />
              </span>
              <span
                className={`text-sm ${
                  pathname === "/contacts"
                    ? "text-orange-500"
                    : "text-gray-700"
                }`}
              >
                Контакты
              </span>
            </Link>
          </div>
        </div>

        <div className="px-3 py-4">
          <div className="space-y-1">
            {loading
              ? renderMobileSkeleton()
              : categories.length > 0
              ? categories.map((category) =>
                  renderCategory(category, 0, closeMenu)
                )
              : (
                <p className="py-4 px-4 text-sm text-gray-500 text-center">
                  Категории не найдены
                </p>
              )}
          </div>
        </div>
      </div>
    </>
  );

  const DesktopSidebarContent = () => (
    <aside className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-72 md:bg-white md:border-r md:border-gray-200 md:z-30">
      <div className="flex-1 overflow-y-auto pt-24 pb-8">
        <div className="px-6 pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            Категории
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Быстрый доступ к товарам по разделам
          </p>
        </div>

        <div className="px-6 py-6 border-b border-gray-200 space-y-2">
          <Link
            href="/about"
            className={`flex items-center gap-3 rounded-xl px-3 py-2 border transition-colors ${
              pathname === "/about"
                ? "border-gray-300 bg-gray-50 text-orange-500 font-medium"
                : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-50"
            }`}
          >
            <IoInformationCircleOutline
              className={`w-5 h-5 ${
                pathname === "/about" ? "text-orange-500" : "text-gray-500"
              }`}
            />
            <span className="text-sm">О сервисе</span>
          </Link>
          <Link
            href="/contacts"
            className={`flex items-center gap-3 rounded-xl px-3 py-2 border transition-colors ${
              pathname === "/contacts"
                ? "border-gray-300 bg-gray-50 text-orange-500 font-medium"
                : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-50"
            }`}
          >
            <IoCallOutline
              className={`w-5 h-5 ${
                pathname === "/contacts" ? "text-orange-500" : "text-gray-500"
              }`}
            />
            <span className="text-sm">Контакты</span>
          </Link>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-1">
            {loading
              ? renderDesktopSkeleton()
              : categories.length > 0
              ? categories.map((category) => renderCategory(category))
              : (
                <p className="py-4 px-4 text-sm text-gray-500 text-center">
                  Категории не найдены
                </p>
              )}
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="md:hidden">
        {isSideMenuOpen && (
          <div
            onClick={closeMenu}
            className="fixed top-0 left-0 w-screen h-screen z-55 bg-black/50 backdrop-blur-sm transition-opacity duration-300 fade-in"
          />
        )}

        <aside
          className={clsx(
            "fixed top-0 right-0 h-screen w-[300px] bg-white z-60 transition-transform duration-300 ease-in-out transform rounded-l-3xl border-l border-gray-200",
            {
              "translate-x-0": isSideMenuOpen,
              "translate-x-full": !isSideMenuOpen,
            }
          )}
        >
          <MobileSidebarContent />
        </aside>
      </div>

      <DesktopSidebarContent />
    </>
  );
};
