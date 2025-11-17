"use client";

import Link from "next/link";
import { IoChevronForward, IoHome } from "react-icons/io5";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {/* Главная страница */}
        <li>
          <Link
            href="/"
            className="flex items-center text-gray-500 hover:text-orange-500 transition-colors"
          >
            <IoHome className="w-4 h-4" />
            <span className="sr-only">Главная</span>
          </Link>
        </li>

        {/* Разделитель после главной */}
        {items.length > 0 && (
          <li>
            <IoChevronForward className="w-4 h-4 text-gray-400" />
          </li>
        )}

        {/* Остальные элементы */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-orange-500 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`${
                  item.isActive
                    ? "text-gray-900 font-medium"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            )}

            {/* Разделитель между элементами */}
            {index < items.length - 1 && (
              <IoChevronForward className="w-4 h-4 text-gray-400 ml-1" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
