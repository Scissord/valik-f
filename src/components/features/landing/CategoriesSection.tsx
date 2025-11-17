"use client";

import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";
import { motion, Variants } from "framer-motion";
import { GoodCategory } from "@/lib/legacy";
import { getCategoryIcon, getCategoryGradient } from "@/lib/legacy";

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

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
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
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.section
        className="py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mb-8">
          <motion.div variants={itemVariantsX}>
            <span className="text-orange-500 text-sm font-medium">Каталог</span>
            <h2 className="text-2xl font-bold text-gray-900">Популярные категории</h2>
          </motion.div>
        </div>
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {isLoadingCategories ? (
            // Скелетон загрузки
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : categories.length > 0 ? (
            categories.map((category, index) => {
              // Проверяем наличие ID
              if (!category.id) {
                console.warn('Категория без ID:', category);
                return null;
              }

              return (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={`/categories/${category.id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all duration-200 p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryGradient(index)} flex items-center justify-center flex-shrink-0 text-white`}>
                          {getCategoryIcon(category.title, category.id)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                            {category.title}
                          </h3>
                        </div>
                        <IoArrowForwardOutline className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              variants={itemVariants}
              className="col-span-full text-center py-16"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Категории не найдены</h3>
              <p className="text-gray-600">Попробуйте обновить страницу</p>
            </motion.div>
          )}
        </motion.div>
      </motion.section>
    </div>
  );
};
