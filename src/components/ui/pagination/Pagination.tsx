"use client";
import { generatePagination } from "@/util";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  // Если страниц нет или всего одна страница, не показываем пагинацию
  if (!totalPages || totalPages <= 1) {
    return null;
  }
  
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get("page") ?? 1;
  const currentPage = !isNaN(+param) && +param > 1 ? +param : 1;
  
  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    if (pageNumber === "...") return `${pathName}?${params.toString()}`;
    if (+pageNumber <= 0) return `${pathName}`;
    if (+pageNumber > totalPages) return `${pathName}?${params.toString()}&page=${totalPages}`;
    params.set("page", pageNumber.toString());
    return `${pathName}?${params.toString()}`;
  };
  
  const numberOfPages = generatePagination(currentPage, totalPages);

  // Добавляем отладочную информацию
  console.log('Pagination Debug:', { totalPages, currentPage, numberOfPages });

  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-32">
      {/* Отладочная информация (видна только в режиме разработки) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 text-xs text-gray-500">
          totalPages: {totalPages}, currentPage: {currentPage}
        </div>
      )}
      
      <nav aria-label="Навигация по страницам">
        <ul className="flex items-center gap-1 md:gap-2">
          {/* Кнопка "Назад" */}
          <li className="page-item">
            <Link
              className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                {
                  "hover:bg-orange-100 text-orange-500": currentPage > 1,
                  "opacity-50 cursor-not-allowed text-gray-400": currentPage <= 1
                }
              )}
              href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
              onClick={e => currentPage <= 1 && e.preventDefault()}
              aria-disabled={currentPage <= 1}
            >
              <IoChevronBackOutline size={20} />
            </Link>
          </li>
          
          {/* Номера страниц */}
          {numberOfPages.map((page, index) => (
            <li key={index} className="page-item">
              {page === "..." ? (
                <span className="flex items-center justify-center w-10 h-10 text-gray-500">
                  ...
                </span>
              ) : (
                <Link
                  className={clsx(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 font-medium",
                    {
                      "bg-orange-500 shadow-sm text-white hover:bg-orange-600": page === currentPage,
                      "text-gray-700 hover:bg-orange-100 hover:text-orange-500": page !== currentPage
                    }
                  )}
                  href={createPageUrl(page)}
                >
                  {page}
                </Link>
              )}
            </li>
          ))}

          {/* Кнопка "Вперед" */}
          <li className="page-item">
            <Link
              className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                {
                  "hover:bg-orange-100 text-orange-500": currentPage < totalPages,
                  "opacity-50 cursor-not-allowed text-gray-400": currentPage >= totalPages
                }
              )}
              href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
              onClick={e => currentPage >= totalPages && e.preventDefault()}
              aria-disabled={currentPage >= totalPages}
            >
              <IoChevronForwardOutline size={20} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
