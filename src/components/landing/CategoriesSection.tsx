"use client";

import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";
import { motion, Variants } from "framer-motion";
import { GoodCategory } from "@/interfaces";
import { getCategoryIcon, getCategoryGradient } from "@/util/categoryIcons";

interface CategoriesSectionProps {
  categories: GoodCategory[];
  isLoadingCategories: boolean;
}

// Функция для генерации описания категории
const getCategoryDescription = (categoryName: string): string => {
  const name = categoryName.toLowerCase();

  if (name.includes('обои')) {
    return 'Рулонные, жидкие, фотообои и другие виды настенных покрытий';
  }
  if (name.includes('сантехник')) {
    return 'Смесители, унитазы, ванны и всё для водопровода';
  }
  if (name.includes('покрытия для пола')) {
    return 'Ламинат, линолеум, паркет и другие напольные покрытия';
  }
  if (name.includes('кафель')) {
    return 'Керамическая плитка для стен и пола';
  }
  if (name.includes('двер') && name.includes('фурнитур')) {
    return 'Входные и межкомнатные двери, замки и фурнитура';
  }
  if (name.includes('мебель')) {
    return 'Мебель для дома и офиса';
  }
  if (name.includes('лак') || name.includes('краск') || name.includes('клей')) {
    return 'Краски, лаки, клеи и материалы для отделки';
  }
  if (name.includes('инструмент')) {
    return 'Электро- и ручные инструменты для любых задач';
  }
  if (name.includes('дом') && name.includes('сад') && name.includes('огород')) {
    return 'Товары для дома, сада и огорода';
  }
  if (name.includes('водоснабжен') || name.includes('отоплен') || name.includes('вентиляц')) {
    return 'Системы водоснабжения, отопления и вентиляции';
  }
  if (name.includes('оборудован')) {
    return 'Профессиональное и бытовое оборудование';
  }
  if (name.includes('декор')) {
    return 'Декоративные элементы и украшения для интерьера';
  }
  if (name.includes('техник') || name.includes('быт')) {
    return 'Бытовая техника для дома';
  }
  if (name.includes('крепёж') || name.includes('крепеж')) {
    return 'Винты, гайки, анкеры и другие крепёжные изделия';
  }
  if (name.includes('материал') || name.includes('строительн')) {
    return 'Строительные и отделочные материалы';
  }
  if (name.includes('электр')) {
    return 'Электротовары и светотехника';
  }
  if (name.includes('авто')) {
    return 'Автомобильные товары и аксессуары';
  }

  return `Качественные товары категории "${categoryName}"`;
};

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

const cardHoverVariants: Variants = {
  hover: {
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const iconVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    rotate: [0, -10, 10, -5, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 0.7 }
  }
};

export const CategoriesSection = ({ categories, isLoadingCategories }: CategoriesSectionProps) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.section
        className="py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
          <motion.div variants={itemVariantsX}>
            <span className="text-orange-500 font-medium">Каталог</span>
            <h2 className="text-3xl font-bold text-gray-900">Популярные категории</h2>
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ x: 5 }}
          >
            <Link
              href="/categories"
              className="text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors font-medium group"
            >
              Все категории
              <IoArrowForwardOutline className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoadingCategories ? (
            // Скелетон загрузки
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
                  whileHover="hover"
                >
                  <Link
                    href={`/categories/${category.id}`}
                    className="group"
                  >
                    <motion.div
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 h-full flex flex-col"
                      variants={cardHoverVariants}
                    >
                      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${getCategoryGradient(index)}`}>
                        <motion.div
                          className="absolute bottom-0 right-0 p-6 text-white"
                          variants={iconVariants}
                        >
                          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                            {getCategoryIcon(category.title, category.id)}
                          </div>
                        </motion.div>
                        <h3 className="absolute bottom-6 left-6 font-bold text-2xl text-white z-10 max-w-[70%] leading-tight">
                          {category.title}
                        </h3>
                      </div>
                      <div className="p-6 flex-1">
                        <p className="text-gray-700 mb-4">
                          {getCategoryDescription(category.title)}
                        </p>
                        <span className="text-orange-500 font-medium inline-flex items-center text-sm group-hover:underline">
                          Перейти в категорию
                          <IoArrowForwardOutline className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </motion.div>
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
