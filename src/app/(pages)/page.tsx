"use client";

import { ProductGrid } from "@/components";
import { getProductsForMainPage, getCategories } from '@/api';
import Link from "next/link";
import { IoArrowForwardOutline, IoCartOutline } from "react-icons/io5";
import { FaTruck, FaCreditCard, FaHeadset } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Product, GoodCategory } from "@/interfaces";
import { getCategoryIcon, getCategoryGradient } from "@/util/categoryIcons";

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

const advantages = [
  {
    icon: <FaTruck className="w-8 h-8" />,
    title: "Доставка по всему Казахстану",
    description: "Быстрая и надежная доставка в любой город"
  },
  {
    icon: <FaCreditCard className="w-8 h-8" />,
    title: "Удобная оплата",
    description: "Наличные, банковские карты, онлайн-платежи"
  },
  {
    icon: <FaHeadset className="w-8 h-8" />,
    title: "Профессиональная консультация",
    description: "Эксперты помогут с выбором товаров"
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<GoodCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем продукты
        const productsResult = await getProductsForMainPage({
          page: 1,
          limit: 8,
        });
        setProducts(productsResult.products || []);

        // Загружаем категории
        setIsLoadingCategories(true);
        const categoriesResult = await getCategories();

        if (categoriesResult && categoriesResult.length > 0) {
          // Берем только родительские категории (без parent_id) и первые 6
          const parentCategories = categoriesResult
            .filter(category => !category.parent_id)
            .slice(0, 6);
          setCategories(parentCategories);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <>
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Всё для <span className="text-orange-500">строительства</span> и <span className="text-orange-500">ремонта</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Качественные материалы и инструменты от ведущих производителей с доставкой по всему Казахстану
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                href="/categories"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 inline-flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/20"
              >
                <IoCartOutline className="w-5 h-5" />
                Каталог товаров
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
            <path
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"
            ></path>
          </svg>
        </div>
      </section>

      <div className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.section
            className="py-24"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-4 text-gray-900">Почему выбирают нас</motion.h2>
            <motion.p variants={itemVariants} className="text-gray-600 text-center max-w-3xl mx-auto mb-16">
              Мы поставляем качественные строительные материалы и инструменты по всему Казахстану
            </motion.p>
            <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover="hover"
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:border-orange-100 transition-all duration-300"
                >
                  <motion.div
                    className="bg-orange-50 text-orange-500 p-4 rounded-2xl inline-flex mb-6"
                    variants={iconVariants}
                  >
                    {advantage.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{advantage.title}</h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

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
                // Заглушка если нет категорий
                <motion.div
                  variants={itemVariants}
                  className="col-span-full text-center py-12"
                >
                  <p className="text-gray-500 text-lg">Категории временно недоступны</p>
                  <p className="text-gray-400 text-sm mt-2 mb-4">Попробуйте обновить страницу</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Обновить страницу
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.section>

          <motion.section
            className="py-24"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
              <motion.div variants={itemVariantsX}>
                <span className="text-orange-500 font-medium">Товары</span>
                <h2 className="text-3xl font-bold text-gray-900">Популярные позиции</h2>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <Link
                  href="/products"
                  className="text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors font-medium group"
                >
                  Все товары
                  <IoArrowForwardOutline className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              variants={itemVariants}
              whileHover={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                transition: { duration: 0.4 }
              }}
            >
              <ProductGrid products={products} />
            </motion.div>
          </motion.section>
        </div>
      </div>
    </>
  );
}
