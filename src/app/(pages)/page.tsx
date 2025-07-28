"use client";

import { ProductGrid } from "@/components";
import { getProductsForMainPage } from '@/api';
import Link from "next/link";
import { IoArrowForwardOutline, IoConstructOutline, IoLayersOutline, IoHomeOutline, IoColorPaletteOutline, IoCartOutline } from "react-icons/io5";
import { FaToolbox, FaScrewdriver, FaPaintRoller, FaTruck, FaCreditCard, FaHeadset } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Product } from "@/interfaces";

const categories = [
  {
    id: 1,
    name: "Инструменты",
    icon: <FaToolbox className="w-8 h-8" />,
    description: "Электро- и ручные инструменты для любых задач",
    image: "/categories/tools.jpg",
    slug: "tools"
  },
  {
    id: 2,
    name: "Материалы",
    icon: <IoLayersOutline className="w-8 h-8" />,
    description: "Строительные и отделочные материалы",
    image: "/categories/materials.jpg",
    slug: "materials"
  },
  {
    id: 3,
    name: "Крепёж",
    icon: <FaScrewdriver className="w-8 h-8" />,
    description: "Винты, гайки, анкеры и другие крепёжные изделия",
    image: "/categories/fasteners.jpg",
    slug: "fasteners"
  },
  {
    id: 4,
    name: "Сантехника",
    icon: <IoConstructOutline className="w-8 h-8" />,
    description: "Всё для водопровода и канализации",
    image: "/categories/plumbing.jpg",
    slug: "plumbing"
  },
  {
    id: 5,
    name: "Отделка",
    icon: <FaPaintRoller className="w-8 h-8" />,
    description: "Краски, декор и отделочные материалы",
    image: "/categories/finishing.jpg",
    slug: "finishing"
  },
  {
    id: 6,
    name: "Освещение",
    icon: <IoHomeOutline className="w-8 h-8" />,
    description: "Светильники и электрооборудование",
    image: "/categories/lighting.jpg",
    slug: "lighting"
  }
];

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProductsForMainPage({
          page: 1,
          limit: 8,
        });
        setProducts(result.products || []);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
      }
    };

    fetchProducts();
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
              {categories.slice(0, 6).map((category) => (
                <motion.div 
                  key={category.id} 
                  variants={itemVariants}
                  whileHover="hover"
                >
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group"
                  >
                    <motion.div 
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 h-full flex flex-col"
                      variants={cardHoverVariants}
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600">
                        <motion.div 
                          className="absolute bottom-0 right-0 p-6 text-white"
                          variants={iconVariants}
                        >
                          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                            {category.icon}
                          </div>
                        </motion.div>
                        <h3 className="absolute bottom-6 left-6 font-bold text-2xl text-white z-10 max-w-[60%] leading-tight">
                          {category.name}
                        </h3>
                      </div>
                      <div className="p-6 flex-1">
                        <p className="text-gray-700 mb-4">{category.description}</p>
                        <span className="text-orange-500 font-medium inline-flex items-center text-sm group-hover:underline">
                          Перейти в категорию
                          <IoArrowForwardOutline className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </motion.div>
                  </Link>
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
