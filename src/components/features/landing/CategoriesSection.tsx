"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
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
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex items-center justify-end mb-4">
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full border transition-all duration-200 ${!canScrollLeft
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
                className={`p-2 rounded-full border transition-all duration-200 ${!canScrollRight
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
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {isLoadingCategories ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-none w-40 sm:w-44 lg:w-48 aspect-[4/5] bg-gray-100 rounded-xl animate-pulse" />
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

            {/* Mobile fade indicators (match page background) */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none sm:hidden" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none sm:hidden" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
