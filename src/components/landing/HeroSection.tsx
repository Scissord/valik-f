"use client";

import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { motion, Variants } from "framer-motion";

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

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-20 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Надежный поставщик <span className="text-orange-500">строительных материалов</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Все для строительства и ремонта с доставкой по Казахстану
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/categories"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 inline-flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/20"
            >
              <IoCartOutline className="w-5 h-5" />
              Перейти в каталог
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
