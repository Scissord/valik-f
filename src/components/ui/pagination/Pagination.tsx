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
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const param=searchParams.get("page") ?? 1;
  const currentPage = !isNaN(+param) && +param>1 ? +param : 1;
  
  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    if (pageNumber === "...") return `${pathName}?${params.toString()}`;
    if (+pageNumber <= 0) return `${pathName}`;
    if (+pageNumber > totalPages) return `${pathName}?${totalPages-1}`;
    params.set("page", pageNumber.toString());
    return `${pathName}?${params.toString()}`;
  };
  const numberOfPages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center mt-10 mb-32">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none">
          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300  text-gray-800 hover:text-gray-800 hover:bg-gray-100 focus:shadow-none"
              href={createPageUrl(currentPage - 1)}
              aria-disabled="true"
            >
              <IoChevronBackOutline size={30} />
            </Link>
          </li>
          {numberOfPages.map((page, index) => (
            <li key={index} className="page-item">
              <Link
                className={clsx(
                  "page-link hover:bg-blue-700 relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded hover:text-white  text-gray-800  focus:shadow-none",
                  {
                    " bg-blue-600 shadow-sm text-white ":
                      page === currentPage,
                  }
                )}
                href={createPageUrl(page)}
              >
                {page}
              </Link>
            </li>
          ))}

          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300  text-gray-800 hover:text-gray-800 hover:bg-gray-100 focus:shadow-none"
              href={createPageUrl(currentPage + 1)}
            >
              <IoChevronForwardOutline size={30} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
