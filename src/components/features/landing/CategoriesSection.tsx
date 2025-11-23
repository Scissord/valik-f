"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { GoodCategory } from "@/lib/legacy";
import { getCategoryIcon, getCategoryGradient } from "@/lib/legacy";
import { useEffect, useRef } from "react";

interface CategoriesSectionProps {
  categories: GoodCategory[];
  isLoadingCategories: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

  useEffect(() => {
    const resetScroll = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    };

    resetScroll();
    window.addEventListener("pageshow", resetScroll);

    return () => {
      window.removeEventListener("pageshow", resetScroll);
    };
  }, []);

  useEffect(() => {
    if (!isLoadingCategories && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [isLoadingCategories, categories.length]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.section
        className="pt-10 pb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mb-8">
          <motion.div variants={itemVariantsX}>
            <span className="text-orange-500 text-sm font-medium">Каталог</span>
            <h2 className="text-2xl font-bold text-gray-900">Все категории</h2>
          </motion.div>
        </div>
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 scrollbar-thin scrollbar-thin-orange"
          >
            {isLoadingCategories ? (
              <div className="flex gap-4 w-max">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-none w-40 sm:w-44 lg:w-48 bg-white rounded-lg border border-gray-200 p-3 animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="flex gap-4 lg:gap-5 w-max snap-x snap-mandatory">
                {categories.map((category, index) => {
                  if (!category.id) {
                    console.warn('Категория без ID:', category);
                    return null;
                  }

                  return (
                    <div
                      key={category.id}
                      className="flex-none w-40 sm:w-44 lg:w-48 snap-start"
                    >
                      <Link
                        href={`/categories/${category.id}`}
                        className="group block h-full"
                      >
                        <div className="bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all duration-200 p-4 h-full flex flex-col items-center text-center gap-2.5">
                          <div className="w-12 h-12 flex items-center justify-center text-orange-500 text-2xl">
                            {getCategoryIcon(category.title, category.id)}
                          </div>
                          <div className="flex-1 flex items-end">
                            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug text-sm">
                              {category.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Категории не найдены</h3>
                <p className="text-gray-600">Попробуйте обновить страницу</p>
              </div>
            )}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-50 to-transparent hidden sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50 to-transparent hidden sm:block" />
        </div>
      </motion.section>
    </div>
  );
};
