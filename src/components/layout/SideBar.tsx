"use client";

import type { ReactNode, ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategories, GoodCategory } from "@/lib/legacy";
import {
  IoChevronDownOutline,
  IoFlashOutline,
  IoBulbOutline,
  IoWaterOutline,
  IoFlameOutline,
  IoColorPaletteOutline,
  IoGridOutline,
  IoBriefcaseOutline,
  IoBuildOutline,
  IoHammerOutline,
  IoConstructOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";
import {
  MdWallpaper,
  MdOutlineLayers,
  MdOutlineDoorFront,
  MdOutlineAir,
  MdRoofing,
  MdOutlineWindow,
} from "react-icons/md";

export const SideBar = () => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<GoodCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Показываем сайдбар только на странице списка товаров
  const shouldShowSidebar = pathname === '/products';

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
      if (String(category.id) === targetId) {
        return [...path, String(category.id)];
      }

      if (category.children && category.children.length > 0) {
        const result = findParent(category.children, targetId, [
          ...path,
          String(category.id),
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
        setExpandedCategories(path);
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

  const getCategoryIcon = (categoryTitle: string): IconType => {
    const title = categoryTitle.toLowerCase();

    if (title.includes("электро") || title.includes("электрик")) return IoFlashOutline;
    if (title.includes("светотехник") || title.includes("освещени")) return IoBulbOutline;
    if (title.includes("водоснабж")) return IoWaterOutline;
    if (title.includes("отоплени")) return IoFlameOutline;
    if (title.includes("вентиляц")) return MdOutlineAir;
    if (title.includes("кровельн")) return MdRoofing;
    if (title.includes("окна") || title.includes("окно")) return MdOutlineWindow;
    if (title.includes("двери") || title.includes("дверь") || title.includes("фурнитур")) return MdOutlineDoorFront;
    if (title.includes("лаки") || title.includes("краски") || title.includes("краска") || title.includes("клей")) return IoColorPaletteOutline;
    if (title.includes("плитк") || title.includes("кафель")) return IoGridOutline;
    if (title.includes("покрытия для пола")) return MdOutlineLayers;
    if (title.includes("отделочн")) return MdOutlineLayers;
    if (title.includes("обои")) return MdWallpaper;
    if (title.includes("сантехник")) return IoBuildOutline;
    if (title.includes("строительн") || title.includes("цемент") || title.includes("бетон")) return IoConstructOutline;
    if (title.includes("инструменты") || title.includes("крепёж")) return IoHammerOutline;

    return IoBriefcaseOutline;
  };

  const renderCategory = (
    category: GoodCategory,
    level = 0
  ): ReactElement => {
    const isExpanded = expandedCategories.includes(String(category.id));
    const hasChildren = category.children && category.children.length > 0;
    const currentCategoryId = getCurrentCategoryId();
    const isActive = currentCategoryId === String(category.id);
    const Icon = getCategoryIcon(category.name);

    const paddingClasses = ["px-3", "pl-6 pr-3", "pl-9 pr-3", "pl-12 pr-3"];
    const paddingClass = paddingClasses[level] || "pl-14 pr-3";

    return (
      <div key={category.id} className="w-full">
        <div
          className={`
            group flex items-center gap-2 py-3 rounded-lg border
            ${paddingClass}
            ${isActive
              ? "border-orange-200 bg-orange-50 text-orange-600 font-semibold"
              : "border-transparent hover:border-gray-200 hover:bg-gray-50"
            }
            transition-all duration-200
          `}
        >
          <Link
            href={`/categories/${category.id}`}
            className="flex flex-1 items-center gap-2 min-w-0"
          >
            <span
              className={`
                shrink-0 text-gray-400 transition-colors group-hover:text-orange-500
                ${isActive ? "text-orange-500" : ""}
              `}
            >
              <Icon className="h-4 w-4" />
            </span>

            <span
              className={`
                truncate ${level > 0 ? "text-xs" : "text-sm"}
                ${isActive ? "text-orange-600" : "text-gray-700 group-hover:text-gray-900"}
              `}
            >
              {category.name}
            </span>
          </Link>

          {hasChildren && (
            <button
              type="button"
              aria-label={
                isExpanded
                  ? `Collapse category ${category.name}`
                  : `Expand category ${category.name}`
              }
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleCategory(String(category.id));
              }}
              className={`
                flex h-7 w-7 items-center justify-center rounded-md
                text-gray-400 transition-colors hover:text-orange-500
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1
              `}
            >
              <IoChevronDownOutline
                className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""
                  }`}
              />
            </button>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1 space-y-1 animate-slideDown">
            {category.children?.map((child) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Don't render sidebar if not on products pages
  if (!shouldShowSidebar) {
    return null;
  }

  return (
    <aside className="hidden md:flex md:flex-col md:sticky md:top-20 md:h-[calc(100vh-80px)] md:w-64 md:bg-white md:border-r md:border-gray-200 md:z-10 pb-6 overflow-y-auto custom-scrollbar">
      <div className="px-4 pt-6">
        {loading ? (
          <p className="py-4 text-center text-sm text-gray-500">
            Загрузка категорий...
          </p>
        ) : categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map((category) => renderCategory(category))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-gray-500">
            Категории не найдены
          </p>
        )}
      </div>
    </aside>
  );
};
