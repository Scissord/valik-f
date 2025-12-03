"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoAppsOutline,
  IoCarOutline,
  IoConstructOutline,
  IoHomeOutline,
  IoHammerOutline,
  IoBriefcaseOutline,
  IoBuildOutline,
  IoCartOutline,
  IoShirtOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";
import { GoodCategory } from "@/lib/legacy";
import { useEffect, useRef, useState } from "react";

interface CategoriesSectionProps {
  categories: GoodCategory[];
  isLoadingCategories: boolean;
}

const getCategoryImage = (category: GoodCategory) => {
  const title = category.title.toLowerCase();

  if (title.includes("инструменты")) return "/category/Инструменты.jpg";
  if (title.includes("мебель")) return "/category/Мебель.jpg";
  if (title.includes("сантехника")) return "/category/Сантехника.jpg";
  if (title.includes("сад")) return "/category/Сад.jpg";
  if (title.includes("оборудование")) return "/category/Обарудование.jpg";
  if (title.includes("авто")) return "/category/Авто.jpg";
  if (title.includes("электро")) return "/category/Электротовары.jpg";
  if (title.includes("строительные материалы")) return "/category/Строительные материалы.jpg";
  if (title.includes("крепёж")) return "/category/Крепеж.jpg";
  if (title.includes("бытовая техника")) return "/category/Бытовая техника.jpg";

  return "/category/Мебель.jpg";
};

const getCategoryIcon = (category: GoodCategory): IconType => {
  const title = category.title.toLowerCase();

  if (title.includes("инструменты")) return IoHammerOutline;
  if (title.includes("мебель")) return IoHomeOutline;
  if (title.includes("сантехника")) return IoBuildOutline;
  if (title.includes("сад")) return IoConstructOutline;
  if (title.includes("оборудование")) return IoConstructOutline;
  if (title.includes("авто")) return IoCarOutline;
  if (title.includes("электро")) return IoCartOutline;
  if (title.includes("строительные материалы")) return IoConstructOutline;
  if (title.includes("крепёж")) return IoHammerOutline;
  if (title.includes("бытовая техника")) return IoShirtOutline;

  return IoBriefcaseOutline;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariantsX: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const CategoriesSection = ({ categories, isLoadingCategories }: CategoriesSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // -10 for tolerance
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories, isLoadingCategories]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = 160 + 16;
    const currentScroll = container.scrollLeft;

    container.scrollTo({
      left: direction === "left" ? currentScroll - cardWidth : currentScroll + cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Mobile categories strip with icons */}
          <div className="sm:hidden mb-4">
            <div className="relative">
              <div
                className="grid grid-rows-2 auto-cols-max grid-flow-col gap-x-2 gap-y-2 overflow-x-auto pb-3 no-scrollbar px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* All categories item */}
                <Link
                  href="/categories"
                  className="flex-none w-20 flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <IoAppsOutline className="w-7 h-7 text-orange-500" />
                  </div>
                  <span className="mt-2 text-[11px] leading-tight text-gray-800">
                    Все категории
                  </span>
                </Link>

                {isLoadingCategories
                  ? Array.from({ length: 7 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex-none w-20 flex flex-col items-center text-center"
                      >
                        <div className="w-14 h-14 rounded-full bg-gray-100 animate-pulse" />
                        <div className="mt-2 h-3 w-12 rounded-full bg-gray-100 animate-pulse" />
                      </div>
                    ))
                  : categories.length > 0
                  ? [...categories].reverse().map((category) => {
                      const Icon = getCategoryIcon(category);
                      return (
                        <Link
                          key={category.id}
                          href={`/categories/${category.id}`}
                          className="flex-none w-20 flex flex-col items-center text-center"
                        >
                          <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                            <Icon className="w-7 h-7 text-orange-500" />
                          </div>
                          <span className="mt-2 text-[11px] leading-tight text-gray-800">
                            {category.title}
                          </span>
                        </Link>
                      );
                    })
                  : null}
              </div>
            </div>
          </div>

          {/* Desktop card carousel */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-end mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    !canScrollLeft
                      ? "border-gray-100 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                  }`}
                  aria-label="Назад"
                >
                  <IoChevronBackOutline className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  disabled={!canScrollRight}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    !canScrollRight
                      ? "border-gray-100 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                  }`}
                  aria-label="Вперед"
                >
                  <IoChevronForwardOutline className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar scroll-px-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {isLoadingCategories ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex-none w-40 sm:w-44 lg:w-48 aspect-[4/5] bg-gray-100 rounded-xl animate-pulse"
                    />
                  ))
                ) : categories.length > 0 ? (
                  [...categories].reverse().map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.id}`}
                      className="flex-none w-40 sm:w-44 lg:w-48 snap-start group block"
                    >
                      <div className="bg-[#f4f5f7] rounded-xl transition-all duration-200 h-full overflow-hidden shadow-none">
                        <div className="relative w-full pt-[90%]">
                          <Image
                            src={getCategoryImage(category)}
                            alt={category.title}
                            fill
                            sizes="160px"
                            priority
                            className="absolute inset-0 w-full h-full object-cover transition duration-200 group-hover:brightness-90"
                          />
                          <div className="absolute inset-x-0 top-0 px-2.5 pt-2 pb-4">
                            <h3 className="font-semibold text-sm text-left text-gray-900 leading-snug">
                              {category.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="w-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl">
                    Категории не найдены
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
