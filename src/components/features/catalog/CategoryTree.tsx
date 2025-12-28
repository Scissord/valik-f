"use client";

import React, { ReactNode, ReactElement, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoodCategory } from "@/lib/legacy";
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

interface Props {
    categories: GoodCategory[];
}

export const CategoryTree = ({ categories }: Props) => {
    const pathname = usePathname();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const currentCategoryId = pathname.match(/\/categories\/(\w+)/)?.[1];

    const getCategoryIcon = (categoryTitle: string) => {
        const iconMatchers: Array<{ keywords: string[]; icon: ReactNode }> = [
            {
                keywords: ["обои", "wall", "wallpaper", "decor"],
                icon: <MdWallpaper className="h-6 w-6" />,
            },
            {
                keywords: ["сантехника", "водоснабжение", "канализац", "water", "plumb", "pipe"],
                icon: <MdOutlineWater className="h-6 w-6" />,
            },
            {
                keywords: ["покрыти", "кафель", "плитк", "панел", "layer", "sheet", "floor"],
                icon: <MdOutlineLayers className="h-6 w-6" />,
            },
            {
                keywords: ["двер", "door"],
                icon: <MdOutlineDoorFront className="h-6 w-6" />,
            },
            {
                keywords: ["мебел", "chair", "furniture"],
                icon: <MdChair className="h-6 w-6" />,
            },
            {
                keywords: ["лак", "краск", "клей", "paint", "отделк"],
                icon: <MdOutlineFormatPaint className="h-6 w-6" />,
            },
            {
                keywords: ["инструмент", "tool", "instrument"],
                icon: <FaTools className="h-6 w-6" />,
            },
            {
                keywords: ["сад", "огород", "агро", "seed", "farm"],
                icon: <MdAgriculture className="h-6 w-6" />,
            },
            {
                keywords: ["отоплен", "вентиляц", "климат", "hvac", "climate", "vent"],
                icon: <MdHvac className="h-6 w-6" />,
            },
            {
                keywords: ["оборудован", "сервис", "service", "repair"],
                icon: <MdHomeRepairService className="h-6 w-6" />,
            },
            {
                keywords: ["декор", "стиль", "style", "design"],
                icon: <MdStyle className="h-6 w-6" />,
            },
            {
                keywords: ["бытов", "кухон", "appliance", "kitchen"],
                icon: <MdMicrowave className="h-6 w-6" />,
            },
            {
                keywords: ["крепеж", "крепёж", "hardware", "fastener"],
                icon: <MdHardware className="h-6 w-6" />,
            },
            {
                keywords: ["строитель", "кирпич", "бетон", "brick", "block"],
                icon: <GiBrickWall className="h-6 w-6" />,
            },
            {
                keywords: ["электро", "кабель", "electric", "wire"],
                icon: <MdElectricalServices className="h-6 w-6" />,
            },
            {
                keywords: ["авто", "автомоб", "auto", "car"],
                icon: <IoCarOutline className="h-6 w-6" />,
            },
            {
                keywords: ["ручной", "hand", "craft", "handyman"],
                icon: <MdHandyman className="h-6 w-6" />,
            },
            {
                keywords: ["отделк", "маляр", "roller"],
                icon: <FaPaintRoller className="h-6 w-6" />,
            },
            {
                keywords: ["дерев", "wood", "beam"],
                icon: <GiWoodBeam className="h-6 w-6" />,
            },
            {
                keywords: ["тепл", "heat", "thermal"],
                icon: <GiHeatHaze className="h-6 w-6" />,
            },
            {
                keywords: ["трактор", "техник", "tractor", "field"],
                icon: <FaTractor className="h-6 w-6" />,
            },
            {
                keywords: ["дом", "home", "housing"],
                icon: <IoHomeOutline className="h-6 w-6" />,
            },
        ];

        const normalizedTitle = categoryTitle.toLowerCase();
        for (const { keywords, icon } of iconMatchers) {
            if (keywords.some((term) => normalizedTitle.includes(term))) {
                return icon;
            }
        }

        return <IoConstructOutline className="h-6 w-6" />;
    };

    const renderCategory = (category: GoodCategory, level = 0): ReactElement => {
        const isExpanded = expandedCategories.includes(String(category.id));
        const hasChildren = category.children && category.children.length > 0;
        const isActive = currentCategoryId === String(category.id);
        const icon = getCategoryIcon(category.title);

        return (
            <div key={category.id} className="w-full">
                <div
                    className={`
            group flex items-center justify-between py-3 rounded-xl border border-transparent
            ${isActive
                            ? "bg-orange-50 border-orange-100"
                            : "hover:bg-gray-50 border-b-gray-100 border-b"
                        }
            transition-all duration-200
          `}
                    style={{ paddingLeft: `${level * 16 + 12}px`, paddingRight: '12px' }}
                >
                    <Link
                        href={`/categories/${category.id}`}
                        className="flex flex-1 items-center gap-4 min-w-0"
                        onClick={(e) => {
                            // Если есть дети, клик по строке раскрывает список (если мобильный UX)
                            // Но лучше ссылка на категорию
                        }}
                    >
                        <div
                            className={`
                shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                ${isActive ? "bg-orange-100 text-orange-600" : "bg-gray-50 text-orange-500 group-hover:bg-gray-100 group-hover:shadow-sm"}
                transition-all duration-200
              `}
                        >
                            {icon}
                        </div>

                        <span
                            className={`
                font-medium truncate
                ${isActive ? "text-orange-900" : "text-gray-900"}
                ${level > 0 ? "text-sm" : "text-base"}
              `}
                        >
                            {category.title}
                        </span>
                    </Link>

                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleCategory(String(category.id));
                            }}
                            className={`
                w-10 h-10 flex items-center justify-center rounded-lg ml-2
                ${isExpanded ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"}
                transition-all
              `}
                        >
                            <IoChevronDownOutline
                                className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            />
                        </button>
                    )}
                </div>

                {isExpanded && hasChildren && (
                    <div className="animate-slideDown">
                        {category.children?.map((child) => renderCategory(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-1">
            {categories.map((category) => renderCategory(category))}
        </div>
    );
};
