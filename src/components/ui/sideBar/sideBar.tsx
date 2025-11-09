"use client";

import type { ReactNode, ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategories } from "@/api";
import { GoodCategory } from "@/interfaces";

import {
  IoCarOutline,
  IoChevronDownOutline,
  IoConstructOutline,
  IoHomeOutline,
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
  const pathname = usePathname();
  const [categories, setCategories] = useState<GoodCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Only show sidebar on /products and /product/{id} pages
  const shouldShowSidebar = pathname === '/products' || pathname.startsWith('/product/');

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

  const getCategoryIcon = (categoryTitle: string) => {
    const iconMatchers: Array<{ keywords: string[]; icon: ReactNode }> = [
      {
        keywords: ["обои", "wall", "wallpaper", "decor"],
        icon: <MdWallpaper className="h-4 w-4" />,
      },
      {
        keywords: ["сантехника", "водоснабжение", "канализац", "water", "plumb", "pipe"],
        icon: <MdOutlineWater className="h-4 w-4" />,
      },
      {
        keywords: ["покрыти", "кафель", "плитк", "панел", "layer", "sheet", "floor"],
        icon: <MdOutlineLayers className="h-4 w-4" />,
      },
      {
        keywords: ["двер", "door"],
        icon: <MdOutlineDoorFront className="h-4 w-4" />,
      },
      {
        keywords: ["мебел", "chair", "furniture"],
        icon: <MdChair className="h-4 w-4" />,
      },
      {
        keywords: ["лак", "краск", "клей", "paint", "отделк"],
        icon: <MdOutlineFormatPaint className="h-4 w-4" />,
      },
      {
        keywords: ["инструмент", "tool", "instrument"],
        icon: <FaTools className="h-4 w-4" />,
      },
      {
        keywords: ["сад", "огород", "агро", "seed", "farm"],
        icon: <MdAgriculture className="h-4 w-4" />,
      },
      {
        keywords: ["отоплен", "вентиляц", "климат", "hvac", "climate", "vent"],
        icon: <MdHvac className="h-4 w-4" />,
      },
      {
        keywords: ["оборудован", "сервис", "service", "repair"],
        icon: <MdHomeRepairService className="h-4 w-4" />,
      },
      {
        keywords: ["декор", "стиль", "style", "design"],
        icon: <MdStyle className="h-4 w-4" />,
      },
      {
        keywords: ["бытов", "кухон", "appliance", "kitchen"],
        icon: <MdMicrowave className="h-4 w-4" />,
      },
      {
        keywords: ["крепеж", "крепёж", "hardware", "fastener"],
        icon: <MdHardware className="h-4 w-4" />,
      },
      {
        keywords: ["строитель", "кирпич", "бетон", "brick", "block"],
        icon: <GiBrickWall className="h-4 w-4" />,
      },
      {
        keywords: ["электро", "кабель", "electric", "wire"],
        icon: <MdElectricalServices className="h-4 w-4" />,
      },
      {
        keywords: ["авто", "автомоб", "auto", "car"],
        icon: <IoCarOutline className="h-4 w-4" />,
      },
      {
        keywords: ["ручной", "hand", "craft", "handyman"],
        icon: <MdHandyman className="h-4 w-4" />,
      },
      {
        keywords: ["отделк", "маляр", "roller"],
        icon: <FaPaintRoller className="h-4 w-4" />,
      },
      {
        keywords: ["дерев", "wood", "beam"],
        icon: <GiWoodBeam className="h-4 w-4" />,
      },
      {
        keywords: ["тепл", "heat", "thermal"],
        icon: <GiHeatHaze className="h-4 w-4" />,
      },
      {
        keywords: ["трактор", "техник", "tractor", "field"],
        icon: <FaTractor className="h-4 w-4" />,
      },
      {
        keywords: ["дом", "home", "housing"],
        icon: <IoHomeOutline className="h-4 w-4" />,
      },
    ];

    const normalizedTitle = categoryTitle.toLowerCase();
    for (const { keywords, icon } of iconMatchers) {
      if (keywords.some((term) => normalizedTitle.includes(term))) {
        return icon;
      }
    }

    return <IoConstructOutline className="h-4 w-4" />;
  };

  const renderCategory = (
    category: GoodCategory,
    level = 0
  ): ReactElement => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;
    const currentCategoryId = getCurrentCategoryId();
    const isActive = currentCategoryId === category.id;
    const icon = getCategoryIcon(category.title);

    const paddingClasses = ["px-3", "pl-6 pr-3", "pl-9 pr-3", "pl-12 pr-3"];
    const paddingClass = paddingClasses[level] || "pl-14 pr-3";

    return (
      <div key={category.id} className="w-full">
        <div
          className={`
            group flex items-center gap-2 py-2 rounded-lg border
            ${paddingClass}
            ${
              isActive
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
              {icon}
            </span>

            <span
              className={`
                truncate ${level > 0 ? "text-xs" : "text-sm"}
                ${isActive ? "text-orange-600" : "text-gray-700 group-hover:text-gray-900"}
              `}
            >
              {category.title}
            </span>
          </Link>

          {hasChildren && (
            <button
              type="button"
              aria-label={
                isExpanded
                  ? `Collapse category ${category.title}`
                  : `Expand category ${category.title}`
              }
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleCategory(category.id);
              }}
              className={`
                flex h-7 w-7 items-center justify-center rounded-md
                text-gray-400 transition-colors hover:text-orange-500
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1
              `}
            >
              <IoChevronDownOutline
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? "rotate-180" : ""
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
    <aside className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-60 md:bg-white md:border-r md:border-gray-200 md:z-30 pt-20 pb-6 overflow-y-auto scrollbar-thin">
      <div className="px-4 pt-8">
        {loading ? (
          <p className="py-4 text-center text-sm text-gray-500">
            Загрузка категорий...
          </p>
        ) : categories.length > 0 ? (
          <div className="space-y-1.5">
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
