"use client";

import Link from "next/link";
import { IoArrowForwardOutline, IoCartOutline } from "react-icons/io5";
import { motion, Variants } from "framer-motion";
import { ProductGrid } from "@/components";
import { Product } from "@/interfaces";

interface ProductsSectionProps {
  products: Product[];
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

export const ProductsSection = ({ products }: ProductsSectionProps) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.section
        className="py-24 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
          <div className="relative z-10">
            <div className="text-center mb-16">
              <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-8">
                Наши товары
              </motion.h2>
              <motion.div
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <Link
                  href="/products"
                  className="text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors font-medium group justify-center"
                >
                  Смотреть все товары
                  <IoArrowForwardOutline className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="relative"
              variants={itemVariants}
            >
              {/* Основной контейнер с товарами */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                {/* Контент */}
                <div className="relative z-10">
                  {products.length > 0 ? (
                    <ProductGrid products={products} />
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="text-center py-16"
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IoCartOutline className="w-12 h-12 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Товары загружаются</h3>
                      <p className="text-gray-600">Пожалуйста, подождите немного</p>
                      <div className="flex justify-center mt-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
      </motion.section>
    </div>
  );
};
