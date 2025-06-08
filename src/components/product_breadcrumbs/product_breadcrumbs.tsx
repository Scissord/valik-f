'use client';

import { useState, useRef, ReactElement } from "react";
import { GoodCategory } from "@/interfaces";
import Link from "next/link";

interface Props {
  product_categories: GoodCategory[];
  className?: string;
}

export const ProductBreadcrumbs = ({
  className,
  product_categories
}: Props) => {
  const [activePath, setActivePath] = useState<number[]>([]);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (level: number, categoryId: number) => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    const newPath = [...activePath.slice(0, level)];
    newPath[level] = categoryId;
    setActivePath(newPath);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setActivePath([]);
    }, 300);
  };

  const renderColumn = (categories: GoodCategory[], level: number): ReactElement => {
    const activeCategory = categories?.find(cat => cat.id === activePath[level]);
    const isFirst = level === 0;

    return (
      <>
        <div
          className={`${css.column} ${isFirst ? 'relative' : 'absolute top-0 z-10'}`}
          style={isFirst ? {} : { left: `${level * 310}px`}}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => {
            if (hideTimeout.current) {
              clearTimeout(hideTimeout.current);
            }
          }}
        >
          {categories?.map((category) => {
            const isActive = category.id === activePath[level];
            return (
              <Link
                key={category.id}
                className={`${css.item} ${isActive ? css.active_item : ""}`}
                onMouseEnter={() => handleMouseEnter(level, category.id)}
                href={`/categories/${category.id}`}
              >
                {category?.title} ({category.totalProductCount})
              </Link>
            );
          })}
        </div>
        {activeCategory?.children && activeCategory?.children.length > 0 &&
          renderColumn(activeCategory.children, level + 1)}
      </>
    );
  };

  const css = {
    column: `
      border border-slate-200
      rounded w-[300px]
      bg-white shadow-sm
      transition-all duration-200
    `,
    item: `
      w-full h-12 flex
      items-center px-2
      border-t first:border-t-0
      border-slate-200
      cursor-pointer
      transition-colors duration-100
      ease-in-out hover:text-white
      hover:bg-[#fc640c] text-xs
    `,
    active_item: `
      bg-[#fc640c] font-medium text-white
    `
  };

  return (
    <div className={className}>
      {renderColumn(product_categories, 0)}
    </div>
  );
};
