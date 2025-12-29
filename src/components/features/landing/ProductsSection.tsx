"use client";

import Link from "next/link";
import { IoArrowForwardOutline } from 'react-icons/io5';
import { motion, Variants } from "framer-motion";
import { ProductGrid } from "@/components";
import { Product } from "@/lib/legacy";

interface ProductsSectionProps {
  products: Product[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const ProductsSection = ({ products }: ProductsSectionProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.section
        className="relative pb-6 md:pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="relative z-10">
          <div className="flex flex-col items-center gap-4 text-center mb-6 md:mb-8">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-center mb-4 text-gray-900"
            >
              Наши товары
            </motion.h2>

            <motion.div variants={itemVariants} whileHover={{ x: 4 }}>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-600 transition-colors group"
              >
                Смотреть все товары
                <IoArrowForwardOutline className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Grid or loader */}
          <motion.div variants={itemVariants}>
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-12 md:py-16">
                {/* Minimal modern loader */}
                <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                      <div className="p-3">
                        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                        <div className="mt-2 h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>


              </div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};
