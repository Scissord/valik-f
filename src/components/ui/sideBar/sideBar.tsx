"use client";

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

  const renderCategory = (category: GoodCategory, level = 0): JSX.Element => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;
    const currentCategoryId = getCurrentCategoryId();
    const isActive = currentCategoryId === category.id;
    const icon = getCategoryIcon(category.title);

    const paddingClasses = ["px-3", "pl-8 pr-3", "pl-12 pr-3", "pl-16 pr-3"];
    const paddingClass =
      paddingClasses[level] || "pl-20 pr-3";

    return (
      <div key={category.id} className="w-full">
        <div
          className={`
            group flex items-center justify-between py-2.5 rounded-md border
            ${paddingClass}
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
            onClick={(event) => event.stopPropagation()}
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
              className={`flex items-center justify-center rounded-full ${
                level > 0 ? "w-4 h-4" : "w-5 h-5"
              } text-gray-500 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <IoChevronDownOutline
                className={level > 0 ? "w-3 h-3" : "w-4 h-4"}
              />
            </div>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1 animate-slideDown">
            {category.children?.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-72 md:bg-white md:border-r md:border-gray-200 md:z-30 pt-24 pb-6 overflow-y-auto">
      <div className="px-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Категории</h2>
        {loading ? (
          <p className="py-4 text-center text-sm text-gray-500">
            Загрузка категорий...
          </p>
        ) : categories.length > 0 ? (
          <div className="space-y-1">
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
